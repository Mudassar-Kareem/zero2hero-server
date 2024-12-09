const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary").v2;
const userModel = require("../model/userModel");
const sendToken = require("../utils/sendToken");


// create user
const createUser = catchAsyncErrors(async (req,res,next)=>{
   try {
    const {name,email,password,avatar} = req.body;
    const isEmailExist = await userModel.findOne({email});
    if(isEmailExist){
        return next(new ErrorHandler("Email already exist",400))
    }
    const myCloud = await cloudinary.uploader.upload(avatar,{
        folder:"avatars",
    })
    const user = await userModel.create({
        name,
        email,
        password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    })
    sendToken(user,201,res,"User created Successfully")
   } catch (error) {
     return next(new ErrorHandler(error.message,500))
   }
})

// user login
const userLogin = catchAsyncErrors(async (req,res,next)=>{
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email}).select("+password");
        if(!user){
            return next(new ErrorHandler("Please provide the correct information",400))
        }
        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            return next(new ErrorHandler("Wrong Email or Password",400))
        }
        sendToken(user,200,res,"User Login Successfully")
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

// remember user
const loadUser = catchAsyncErrors(async (req,res,next) =>{
    try {
        const user= await userModel.findById(req.user.id);
        if(!user){
            return next(new ErrorHandler("User not found",404))
        }
        res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

// logout user
const logoutUser = catchAsyncErrors(async(req,res,next)=>{
    try {
        res.cookie("token", null,{
            expires: new Date(0),
            httpOnly:true
        })
        res.status(200).json({
            success:true,
            message:"Logged out successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

// get all users
const getAllUser = catchAsyncErrors(async (req,res,next)=>{
    try {
        const users = await userModel.find();
        res.status(200).json({
            success:true,
            users
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

module.exports = {
    createUser, userLogin, loadUser, logoutUser, getAllUser
}