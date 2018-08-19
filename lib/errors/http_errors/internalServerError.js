'use strict';

function internalServerError(message, errorCode) {

  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.success = false
  this.message = message || 'Something went wrong please try later.';
  this.statusCode = 500;
  this.errorCode = errorCode || 500;
};

module.exports = {internalServerError};
