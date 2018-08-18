const express = require('express');
const {makeTransfer} = require("../app/controllers/transfers.js");
let {idemptency} = require('../middleware/idempotent');

let router = express.Router();

router.get('/', function (req, res, next) {
    res.status(200).json({'message': 'Welcome to banking open api'});
});

router.post('/transactions/', idemptency, makeTransfer);

module.exports = {router};
