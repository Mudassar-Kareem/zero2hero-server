const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    message:{
        type: String,
        required: true
    },
    type:{
        type: String,
        default: ""
    },
    points:{
        type: Number,
        default: 0
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }  
})

const transactionModel = mongoose.model("Transaction",transactionSchema);
module.exports = transactionModel;