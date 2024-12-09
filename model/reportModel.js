const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    location:{
        type: String,
        required: true
    },
    weight:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    image:{
        public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
    },
    status:{
        type: String,
        default: "pending"
    },
    collectorId:{
        type: String,
        default: null,
    },
    userId:{
        type: String,
        required: true,
    }
},{timestamps:true})

const reportModel = mongoose.model("Report",reportSchema);
module.exports = reportModel;