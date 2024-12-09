const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"],
      },
      email: {
        type: String,
        required: [true, "Please enter your email!"],
      },
      password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [4, "Password should be greater than 4 characters"],
        select: false,
      },
      role: {
        type: String,
        default: "user",
      },
      avatar: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
      point:{
        type:Number,
        default:0,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
});

// hash pasword
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next
    }
    this.password = await bcrypt.hash(this.password,10)
});

// compare password
userSchema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword,this.password)
}

// get jwt token
userSchema.methods.getJwtToken= function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: "7d",
    })
}

const userModel = mongoose.model("User",userSchema);
module.exports = userModel;