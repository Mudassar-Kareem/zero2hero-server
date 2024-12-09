const express = require('express');
const { createReport, getAllReports, updateReportStatus, completeTask } = require('../controllers/reportController');
const reportRouter = express.Router();
const { isAuthenticated } = require("../middleware/auth");

reportRouter.post('/createReport',isAuthenticated ,createReport);
reportRouter.get('/getReports', getAllReports);
reportRouter.put('/updateReport/:id', isAuthenticated, updateReportStatus);
reportRouter.put('/completeReport/:id', isAuthenticated, completeTask);


module.exports = reportRouter