const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    message:{
        type: String,
        required: true
    },
    status:{
        type: String,
        default: "unread"
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

const notificationModel = mongoose.model("Notification",notificationSchema);
module.exports = notificationModel;