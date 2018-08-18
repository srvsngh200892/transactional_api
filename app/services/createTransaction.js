'use strict';

const {dbConnection} = require("../../config/database");
const redisClient = require('../../config/redis-client');
let {internalServerError} = require('../../lib/errors/http_errors/internalServerError');
let {notAcceptable} = require('../../lib/errors/http_errors/notAcceptable');
let {resourceNotFound} = require('../../lib/errors/http_errors/resourceNotFound');

function createTransfer(senderIban, receiverIban, transferAmount, idempotentKey) {
	return new Promise(async (resolve, reject) => { // <--- this line

		const dbConn = await dbConnection();
	    try {
	        await dbConn.beginTransaction();
	        // Use execute as it runs a prepared statement which allows you to bind parameters to avoid SQL injection
	        let [[senderAccountRow]] = await dbConn.execute('Select account_nr, balance FROM balances WHERE account_nr = ? FOR UPDATE', [senderIban]);
	        let [[receiverAccountRow]] = await dbConn.execute('Select account_nr, balance FROM balances WHERE account_nr = ? FOR UPDATE', [receiverIban]);
	        
	        if (!senderAccountRow || !receiverAccountRow) {
	            await dbConn.rollback();
	            return reject(new resourceNotFound());
	        }

	        if (senderAccountRow.balance < transferAmount) {
	            await dbConn.rollback();
	            return reject(new notAcceptable('Insufficient funds'));
	        }
	        
	        // update the sender balance
	        await dbConn.execute('UPDATE balances SET balance = balance - ?  WHERE account_nr = ?', [transferAmount, senderIban]);

	        // insert the sender transaction history
	        await dbConn.execute('INSERT INTO transactions (amount, account_nr) VALUES ( ?, ?)', [transferAmount, senderIban]);
	        
	        // update the sender balance
	        await dbConn.execute('UPDATE balances SET balance = balance + ?  WHERE account_nr = ?', [transferAmount, receiverIban]);

	        // insert the sender transaction history
	        const [senderTransaction] = await dbConn.execute('INSERT INTO transactions (amount, account_nr) VALUES ( ?, ?)', [transferAmount, receiverIban]);
            
            await dbConn.execute('INSERT INTO transactions (amount, account_nr) VALUES ( ?, ?)', [transferAmount, receiverIban]);
            
	        await dbConn.commit();

            let response =  { "success": true, 
                              "transaction_reference": senderTransaction.insertId,
                              "message": "Successfully Transferred", 
                              "status": "completed" 
                            }

	        if (idempotentKey) {

	            await redisClient.setAsync(idempotentKey, response);
	            await redisClient.expireAsync(idempotentKey, process.env.KEY_EXPIRE_TIME)
	        } 
            
	        return resolve(response)

	    } catch (error) {
	    	console.log(error)
	        await dbConn.rollback();
	        return reject(new internalServerError());
	    }
    });
}


module.exports = {createTransfer};
