const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const transactionModel = require("../model/transctionModel");
const ErrorHandler = require("../utils/ErrorHandler");

// get user transactions
const getTransactions = catchAsyncErrors(async (req, res, next) => {
    try {
        const userId = req.user.id;
        const transactions = await transactionModel.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            transactions
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

module.exports = { getTransactions }