'use strict';

const {internalServerError} = require('../lib/errors/http_errors/internalServerError');
const redisClient = require('../config/redis-client');

async function idemptency(req, res, next) {
  const idempotentKey = req.headers['idempotent-key'];
  if (idempotentKey) {
  	try {
	  let payload = await redisClient.hgetAllAsync(idempotentKey);
	  if (payload) {
	  	return res.status(200).json(payload)
	  }	
	}
	catch(e) {
	  console.log(e);
	  const serverError = new internalServerError();
	  return res.status(serverError.statusCode).json(serverError)
	}
  }
  next();
}

module.exports = {idemptency};
