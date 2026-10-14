const router = require("express").Router();
const {getEmails, getStoredEmails, getEmailsByCategory, getEmailById, processSingleEmailById} = require("../controllers/emailController");
const ensureAuth =require("../middleware/authMiddleware");
const refreshAccessToken =
require("../services/tokenService");
const User = require("../models/User");
const syncUser = require("../services/gmailSyncService");
const syncQueue= require("../queues/syncQueue");

router.get(
    "/test-token",
    async(req,res)=>{

        const token =
        await refreshAccessToken(
            req.user.refreshToken
        );

        res.json({
            token
        });

    }
);

router.get(
    "/test-sync",

    async(req,res)=>{

        const user =
            await User.findOne({
                googleId:
                    req.user.googleId
            });

        const result =
            await syncUser(
                user
            );

        res.json(
            result
        );

    }
);
router.get(
    "/test-sync-job",

    async(req,res)=>{
        const user =
            await User.findOne({
                googleId:
                    req.user.googleId
            });


        await syncQueue.add(

            "sync-user",

            {
                userId:
                    user._id
            }

        );

        res.json({
            message:
                "Sync job queued"
        });

    }
);

router.get("/fetch",ensureAuth, getEmails);
router.get("/stored",ensureAuth,getStoredEmails);
router.get("/category/:category", ensureAuth,getEmailsByCategory);
router.get("/:id", ensureAuth, getEmailById);
router.post("/:id/process", ensureAuth, processSingleEmailById);
module.exports=router;

