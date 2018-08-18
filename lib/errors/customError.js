'use strict';

function customError(name, message, statusCode, errorCode) {

  Error.captureStackTrace(this, this.constructor);

  this.name = name || 'customError';
  this.success = false
  this.message = message || 'Custom Error without message';
  this.statusCode = statusCode || 400;
  this.errorCode = errorCode || 400;
};

module.exports = {customError};
