const router = require("express").Router();
const passport = require("passport");


router.get('/google', 
    passport.authenticate("google",{
        scope:["profile", "email", "https://www.googleapis.com/auth/gmail.readonly"

        ],
        accessType: "offline",
        prompt: "consent"
    })

);

router.get("/google/callback",
    passport.authenticate("google",{
        failureRedirect:'/'
    }),
    (req,res)=>{
        //res.send("Google Login Successful");
        res.redirect(process.env.FRONTEND_PORT);
    }

);

router.get("/me", (req,res)=>{
    if (!req.user){
        return res.status(401).json({authenticated:false});
        
    }
    res.json({authenticated:true, user: {id:req.user._id,
        googleId:req.user.googleId,
        name:req.user.name,
        email: req.user.email
    }});
});


router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if (err){
            return res.status(500).json({message:"Logout Failed"});

        }
        req.session.destroy(()=>{
            res.json({sucess:true});
        });
    });
});

module.exports=router;