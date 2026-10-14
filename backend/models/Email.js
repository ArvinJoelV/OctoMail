const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema({
    userId:{type: String, required: true, index: true},
    gmailId: {type:String, required: true, unique: true},
    threadId: String,
    sender: String,
    subject: String,
    body: String,
    snippet: String,
    receivedAt: Date,
    processed:{
        type:Boolean,
        default:false
    },
    summary:{
        type:String,
        default:""
    },
    priority:{
        type:String,
        default:""
    },
    embedding:{
        type:[Number],
        default:[]
    },
    tasks:{
        type:[String],
        default:[]
    },
    deadlines:{
        type:[String],
        default:[]
    },
    category:{
        type:String,
        default: "other"
    }
    
},{timestamps:true

});

module.exports=mongoose.model("Email",EmailSchema);


