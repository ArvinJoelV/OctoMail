const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
    userId: {
        type:String,
        required:true
    },
    emailId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Email",
        unique:true
    },
    title:{
        type:String,
        required:true

    },
    message:{
        type: String,
        required: true
    }
    ,
    type:{
        type:String,
        enum:["deadline",
            "priority",
            "placement",
            "system","academic"],
            default: "system"
    },
    read:{type:Boolean,
        default:false
    }
},{timestamps:true});

module.exports= mongoose.model("Notification",NotificationSchema);
