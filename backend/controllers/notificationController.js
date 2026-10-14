const Notification = require("../models/Notification");

async function getNotification(req,res){
    try{
        const notifications = await Notification.find({
            userId: req.user.googleId
        }).sort({createdAt:-1});

        res.json(notifications);
        
    }
    catch(err){
        console.log(err);
        res.status(505).json({error:"Failed to get Notification"});
    }
}

async function getUnreadCount(req,res){
    try{
    const count= await Notification.countDocuments({
        userId:req.user.googleId,
        read:false
    });
    res.json({unread: count});
}
    catch(err){
        console.log(err);

        res.status(500).json({
            error:"Failed to fetch count"
        });

    }
}

async function markRead(req,res){
    try{
        await Notification.findByIdAndUpdate(req.params.id
            ,{read:true});
        res.json({message:"Notification marked as read"});

    }
    catch(err){
    console.log(err);

        res.status(500).json({
            error:"Failed to mark as read"
        });
    }

}

async function markAllRead(req,res){
    try{
        await Notification.updateMany({
            userId:req.user.googleId,
            read:false
        },{read:true});
        res.json({message: "Marked all as Read"})
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error:"Failed to update notifications"
        });

    }

}

module.exports= {markAllRead,markRead, getNotification,getUnreadCount};
