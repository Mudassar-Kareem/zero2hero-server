const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary").v2;
const reportModel = require("../model/reportModel");
const userModel = require("../model/userModel");
const notificationModel = require("../model/notificationModel");
const transactionModel = require("../model/transctionModel");

// Create Report
const createReport = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    const { location, weight, type, image } = req.body;
    let myCloud;
    try {
      myCloud = await cloudinary.uploader.upload(image, {
        folder: "waste",
      });
    } catch (cloudinaryError) {
      return next(new ErrorHandler("Image upload failed", 500));
    }
    const report = await reportModel.create({
      location,
      weight,
      type,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      userId,
    });

    // Update user points
    user.point += 10;
    await user.save();
    const notificationMessage = "You have earned 10 points for reporting waste!";
    await notificationModel.create({
        userId,
        message: notificationMessage
    })

    await transactionModel.create({
      userId,
      message: "You have earned points for reporting waste",
      type: "earned_report",
      points: 10,
    })

    // Send success response
    res.status(201).json({
      success: true,
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// get all reports
const getAllReports = catchAsyncErrors(async(req,res,next)=>{
  try {
   const reports = await reportModel.find();
    res.status(200).json({
      success:true,
      reports
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
})

// update report status
const updateReportStatus = catchAsyncErrors(async(req,res,next)=>{
  try {
    const {id} = req.params;
    const collectorId = req.user.id;
    const report = await reportModel.findById(id);
    if (!report) {
      return next(new ErrorHandler("Report not found", 404));
    }
    report.status = "in_progress";
    report.collectorId = collectorId;
    await report.save();

    res.status(200).json({
      success: true,
      message: "Report updated",
    });
    
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
})

// complete task
const completeTask = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    const report = await reportModel.findById(id);
    if (userId !== report.collectorId) {
      return next(
        new ErrorHandler("You are not authorized to complete this task", 401)
      );
    }
    report.status = "completed";
    await report.save();
    await notificationModel.create({
      userId,
      message:
        "Congratulations! You have earned 50 points for collecting waste!",
    });
    user.point += 50;
    await user.save();
    await transactionModel.create({
      userId,
      message: "You have earned points for collecting waste",
      type: "earned_collect",
      points: 50,
    })
    res.status(200).json({
      success: true,
      message: "Task completed",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = {
  createReport,
  getAllReports,
  updateReportStatus,
  completeTask,
};
