'use strict';

function serviceUnavailable(message, errorCode) {

  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.success = false
  this.message = message || 'Service Unavailable';
  this.statusCode = 503;
  this.errorCode = errorCode || 503;
};

module.exports = {serviceUnavailable};
