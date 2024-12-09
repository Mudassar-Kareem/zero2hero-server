const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const userModal = require('../model/userModel');

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler('Please login to continue', 401));
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModal.findById(decoded.id);
    next();
});