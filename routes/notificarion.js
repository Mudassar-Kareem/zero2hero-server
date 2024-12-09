const express = require('express');
const { getUserNotifications, updateNotificationStatus } = require('../controllers/notificationController');
const notificationRouter = express.Router();
const { isAuthenticated } = require("../middleware/auth");

notificationRouter.get('/notifications',isAuthenticated, getUserNotifications);
notificationRouter.put("/notification/:id", updateNotificationStatus)

module.exports = notificationRouter;
