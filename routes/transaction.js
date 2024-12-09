const express = require('express');
const transactionRouter = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const { getTransactions } = require('../controllers/transcationController');

transactionRouter.get('/transactions',isAuthenticated, getTransactions);

module.exports = transactionRouter;