'use strict';
let {badRequest} = require('../../lib/errors/http_errors/badRequest');
let {forbidden} = require('../../lib/errors/http_errors/forbidden');

function makeTransferValidator(senderIban, receiverIban, transferAmount) {
  return new Promise(function(resolve, reject) {

    if (!senderIban || !receiverIban || !transferAmount) {
	  reject(new badRequest());
	} else if (senderIban === receiverIban) {
      reject(new forbidden('Transfer to same account not allowed'));
	} else if (transferAmount <= 0) {
	  reject(new forbidden('Invaild amount'));
	} else {
	  resolve(); 
	}
  });
};  

module.exports = {makeTransferValidator};
