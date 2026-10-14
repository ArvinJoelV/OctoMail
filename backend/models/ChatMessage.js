const mongoose = require("mongoose");

const ChatMessageSchema= new mongoose.Schema({
    userId: {
        type:String,
        required:true
    },
    role:{
        type:String,
        enums:["AI","User"],
        required:true
    },
    content:{
        type:String,
        required:true
    },

},{
    timestamps:true
});

module.exports= mongoose.model("ChatMessage",ChatMessageSchema);

