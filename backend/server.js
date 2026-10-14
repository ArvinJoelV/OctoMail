const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
require("./config/passport");
const authRoutes = require("./routes/authRoutes");
const emailRoutes=require("./routes/emailRoutes");
const aiRoutes = require("./routes/aiRoutes")
const searchRoutes = require("./routes/searchRoutes");
const copilotRoutes= require("./routes/copilotRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const digestRoutes = require("./routes/digestRoutes");


const app = express();

app.use(cors({origin: process.env.FRONTEND_PORT, credentials:true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false

    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',authRoutes);
app.use("/emails",emailRoutes);
app.use("/ai",aiRoutes);
app.use("/search",searchRoutes);
app.use("/copilot",copilotRoutes);
app.use("/notifications",notificationRoutes);
app.use("/digest",digestRoutes);

app.get('/',(req,res)=>{
    res.send("Octomail Backend Running");
});

const PORT = process.env.PORT || 5000; 


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected");
}).catch((err)=>{
    console.error(`MongoDB Connection Error: ${err.message}`);
});

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});


