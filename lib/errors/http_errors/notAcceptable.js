'use strict';

function notAcceptable(message, errorCode) {

  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.message = message || 'Not Acceptable';
  this.statusCode = 406;
  this.errorCode = errorCode || 406;
};

module.exports = {notAcceptable};
