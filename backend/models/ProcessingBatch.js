const mongoose = require("mongoose");

const ProcessingBatchSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    totalEmails:{
        type:Number,
        default:0
    },
    completedEmails:{
        type:Number,
        default:0
    },
    failedEmails:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        enums:["processing","completed","failed"],
        default:"processing"
    }

},{timestamps:true});

module.exports = mongoose.model("ProcessingBatch",ProcessingBatchSchema);
