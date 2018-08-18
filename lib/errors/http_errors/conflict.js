'use strict';

function conflict(message, errorCode) {

  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.success = false
  this.message = message || 'Conflict';
  this.statusCode = 409;
  this.errorCode = errorCode || 409;
};

module.exports = {conflict};
