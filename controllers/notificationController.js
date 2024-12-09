const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const notificationModel = require("../model/notificationModel");

// get user notifications
const getUserNotifications = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifications = await notificationModel
      .find({ userId, status: "unread" })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update Status
const updateNotificationStatus = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await notificationModel.findById(id);
    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    }
    notification.status = "read";
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification removed",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});



module.exports = {
  getUserNotifications,
  updateNotificationStatus,
};
