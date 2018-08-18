let {makeTransferValidator} = require('../validators/transfers');
let {createTransfer} = require('../services/createTransaction');
const redisClient = require('../../config/redis-client');

async function makeTransfer(req, res, next) {
    const transferAmount = req.body.amount;
    const senderIban = req.body.from;
    const receiverIban = req.body.to;
    const idempotentKey = req.headers['idempotent-key']

    try {

        await makeTransferValidator(senderIban, receiverIban, transferAmount);

        let response = await createTransfer(senderIban, receiverIban, transferAmount, idempotentKey);

        return res.status(201).json(response)

    } catch(error) {
        if (idempotentKey) {
            try {
               await redisClient.setAsync(idempotentKey, JSON.stringify(error));
            } catch(e) {
               return res.status(error.statusCode).json(error);  
            }    
         }
        return res.status(error.statusCode).json(error);
    }

}

module.exports = {makeTransfer}
