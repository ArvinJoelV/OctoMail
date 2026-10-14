const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true
    },
    email: String,
    name:String,
    accessToken:String,
    refreshToken:String,
    lastSyncedAt:{
        type: Date,
        default:null
    },
    lastHistoryId:{
        type:String,
        default: null
    }

});

module.exports=mongoose.model("User",UserSchema);


