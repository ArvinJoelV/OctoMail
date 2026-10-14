const Notification =require("../models/Notification");

async function createNotificationForEmail(email){
    const existing = await Notification.findOne({
        emailId: email._id
    });
    if (existing){return;}
    let shouldNotify= false;
    let type= "priority";
    let title =email.subject;
    let message="";
     if(
        email.deadlines &&
        email.deadlines.length > 0
    ){

        shouldNotify = true;

        type = "deadline";

        message =
        `Upcoming deadline: ${email.deadlines.join(", ")}`;

    }

    // Placement

    else if(
        email.category === "placement"
    ){

        shouldNotify = true;

        type = "placement";

        message =
        "New placement related email received.";

    }

    // Finance

    else if(
        email.category === "academic"
    ){

        shouldNotify = true;

        type = "academic";

        message =
        "Important academic related email received.";

    }

    // High Priority

    else if(
        email.priority === "high"
    ){

        shouldNotify = true;

        type = "priority";

        message =
        "High priority email requires attention.";

    }

    if(!shouldNotify){
        return;
    }
    await Notification.create({
        userId:email.userId,
        emailId:email._id,
        title,message,type
    });

}

module.exports= createNotificationForEmail;

