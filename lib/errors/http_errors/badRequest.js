'use strict';

function badRequest(message, errorCode) {

  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name || 'badRequest';
  this.success = false
  this.message = message || 'The request was unacceptable, often due to missing a required parameter';
  this.statusCode = 400;
  this.errorCode = errorCode || 400;
};

module.exports = {badRequest};
