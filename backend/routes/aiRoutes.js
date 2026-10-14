const router = require("express").Router();

const ensureAuth = require("../middleware/authMiddleware");

const { findProcessStatus,
    processEmails
} = require("../controllers/aiController");

router.post(
    "/process",
    ensureAuth,
    processEmails
);
router.get("/status",ensureAuth,findProcessStatus);

module.exports = router;