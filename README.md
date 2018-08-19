## transactional_api
## Node.js based transactional api

== INSTALLATION INSTRUCTION

Things you need to know for this application :

* clone this repo
* cd ~/path/transactional_api     # Change to the source directory
* npm install                     # Install package manager
* cp .env.example .env            # Copy example configuration
* add correct config              # change config
* brew install mysql              # install mysql
* brew insall redis               # install redis
* brew insall mysql               # install mysql

```
* Open mysql and create database and table
    - CREATE DATABASE IF NOT EXISTS banking;
    - CREATE TABLE IF NOT EXISTS  balances ( account_nr int NOT NULL AUTO_INCREMENT, balance int  unsigned NOT NULL DEFAULT 0, PRIMARY KEY(account_nr));
    - CREATE TABLE IF NOT EXISTS  transactions (reference int NOT NULL AUTO_INCREMENT , account_nr int NOT NULL,  amount int NOT NULL , PRIMARY KEY(reference) , FOREIGN KEY (account_nr) REFERENCES balances(account_nr));
    - Insert two accounts and balance like 
      - INSERT INTO balances (account_nr, balance) VALUES (1234, 200); #First account
      - INSERT INTO balances (account_nr, balance) VALUES (1235, 300); #First account
```
      
              
* brew services start redis  # Start redis server
* npm start                  # Start Server on port 3000

## How to try api call
 * Open Postman
 ```
  - Select Method POST
  - api endpoint - http://localhost:3000/transactions
  - Headers
    - Content-Type : application/json
    - idempotent-key : random uuid4();    # Recommended to send ( Make Post request Idempotent ), If not send make post request retry dangerous
    - body {from:account, to:account, amount:money}
    - sucess reponse - {
                            "success": true,
                            "transaction_reference": 113,
                            "message": "Successfully Transferred",
                            "status": "completed"
                        }
     - error response structure - {
                                    "name":  "error name",
                                    "message": "message",
                                    "statusCode": status_code,
                                    "errorCode": error_code
                                  }
      
 ```
 ## Why i changed error response
   ```
    Just send client transaction id, so that they can perform get request. Check above success response structure.
    
   ```
 
 ## How I handle case when client double click by mistake or when client and server connection breaks in between
  ```
  # Cases -
   As post request is non-idempotent in nature, if user double click, then we end up creating duplicate payment.
   Or when Client make post request and client din't get respone back due network issue, it's not safe to retry as it may end up 
   in duplicate request.
  
  # Solution: ( Check idempotent.js inside middleware/dempotent.js)
    - I have made post request idempotent in nature by creating a middleware which does following
    
    - For every POST request client send to server it include particular header
       # idempotent-key : random uuid4();
       
    - Server store this key and respone of request inside redis (key-vaue pair). Key expires in 24 hours.
    
    - If client send the same request again with the same idempotent-key
       - Server intercept the resquest at middleware level and find key in redis 
         - if key exist then server send the same respone back to client. 
         - If key doesn't exits sever middleware  pass the request to controller to continue with request.
         - Expire the key after 24 hours
       
    **This way if user double click or client send the same request again, it won't create duplicate transaction record.
    
    ***Many payment gateway follow this approach like STRIPE, PAYPAL etc
   ``` 
    
  ## Why i choose redis to store idempotent-key
     ``` 
      Redis is one of the best in-memory database and it's easy to expire key and we don't need this data for long.
     ```
  
  ## How i handle two conncurrent request
    ``` 
     * Two solutions
     
       1)  SELECT FOR UPDATE 
         - Adding FOR UPDATE to the end of the select statement will lock these rows, a
           s if doing an UPDATE statement. This means other transactions can’t lock or modify these rows.
        
        2) SELECT… LOCK IN SHARE MODE — This is a somewhat in-between lock. It does not fully lock the rows as the UPDATE. 
           Instead it puts a soft lock on those rows, which stops other transactions from modifying these rows, 
           but they can run select statements, and once your transaction commits, will use the new values to continue.
           
        * currently i have implemented solution using FOR UPDATE and 
          if there are performance issues, then will think of  possibly using SHARE MODE.
     ```
  
  ## How i handle errors (Implemented inside #lib/http_errors)
     ```
      * I have created a different http errosr inside lib flolder
     ```
 
 ## Different Validation ( Implemented inside #validation/transfer.js)
   ```
     - Bad Request 400 - when client sends some bad data or missing
     
     - Not Acceptable 406 - When sender don't have Insufficient balance
     
     - Forbidden 403 - When client send amount <= 0
     
     - Forbidden 403 - When sender and receiver account number is same
     
     - Internal server error 500 - When something went wrong at server side.
   ```
