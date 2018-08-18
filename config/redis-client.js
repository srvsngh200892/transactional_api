'use strict';

const redis = require('redis');
const {promisify} = require('util');
const client = redis.createClient(process.env.REDIS_URL);

client.on("error", (err)=>{
    console.log("Error " + err);
});

client.on('connect',()=>{
    console.log('Successfully connected to redis');
})



module.exports = {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.hmset).bind(client),
  keysAsync: promisify(client.keys).bind(client),
  hgetAllAsync: promisify(client.hgetall).bind(client),
  expireAsync: promisify(client.expire).bind(client),
};
