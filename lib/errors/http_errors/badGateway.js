'use strict';

function badGateway(message, errorCode) {

  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.message = message || 'Bad Gateway';
  this.success = false
  this.statusCode = 502;
  this.errorCode = errorCode || 502;
};

module.exports = {badGateway};
