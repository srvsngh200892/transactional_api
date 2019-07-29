require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const {resourceNotFound} = require('./lib/errors/http_errors/resourceNotFound');
const {router} = require('./config/router');

const app = express();

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);


app.use(function (req, res, next) {
    next(new resourceNotFound());
});

app.use((err, req, res, next) => {
  if (req.app.get('env') !== 'development' && req.app.get('env') !== 'test') {
    delete err.stack;
  }
  
  res.status(err.statusCode || 500).json(err);
});


app.listen( process.env.PORT || 3000);


module.exports = {app};
