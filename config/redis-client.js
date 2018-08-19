'use strict';

const redis = require('redis');
const {promisify} = require('util');
const client = redis.createClient(process.env.REDIS_URL, {
    connection_strategy: function (options) {
        if (options.total_retry_time > 1000 * 60 * 60) {
            // kill the client with the error event
            return new Error('Retry time exhausted');
        }
        // attempt reconnect after this delay
        return Math.min(options.attempt * 100, 3000);
    },
    retry_strategy: function (options) {
        if (options.attempt >= 3) {
            // flush all pending commands with this error
            return new Error('Redis unavailable');
        }
        // let the client maintain its existing queues
        return null;
    }
});


module.exports = {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.hmset).bind(client),
  keysAsync: promisify(client.keys).bind(client),
  hgetAllAsync: promisify(client.hgetall).bind(client),
  expireAsync: promisify(client.expire).bind(client),
};
