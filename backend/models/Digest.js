const mongoose = require("mongoose");

const DigestSchema = new mongoose.Schema({

    userId:{
        type:String,
        required:true
    },

    date:{
        type:String,
        required:true
    },

    content:{
        type:String,
        required:true
    }

},{
    timestamps:true
});

module.exports =
mongoose.model(
    "Digest",
    DigestSchema
);