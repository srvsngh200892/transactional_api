'use strict';

function unprocessableEntity(message, errorCode) {

  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.success = false
  this.message = message || 'Unprocessable Entity';
  this.statusCode = 422;
  this.errorCode = errorCode || 422;
};

module.exports = {unprocessableEntity};
