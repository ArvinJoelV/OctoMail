const { getNotification, getUnreadCount, markRead, markAllRead } = require("../controllers/notificationController");
const ensureAuth = require("../middleware/authMiddleware");

const router = require("express").Router();

router.get("/",ensureAuth,getNotification);
router.get("/count",ensureAuth, getUnreadCount);
router.patch("/:id/read",ensureAuth, markRead);
router.patch("/read-all",ensureAuth,markAllRead);

module.exports= router;
