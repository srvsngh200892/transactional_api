require('dotenv').config();

let express = require('express');
let logger = require('morgan');
let {resourceNotFound} = require('./lib/errors/http_errors/resourceNotFound');
let {router} = require('./config/router');

let app = express();

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
