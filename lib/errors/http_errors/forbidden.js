'use strict';

function forbidden(message, errorCode) {

  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.success = false
  this.message = message || 'Forbidden';
  this.statusCode = 403;
  this.errorCode = errorCode || 403;
};

module.exports = {forbidden};
