const express =
require("express");

const router =
express.Router();

const ensureAuth =
require("../middleware/authMiddleware");

const {
    getTodayDigest
} = require(
    "../controllers/digestController"
);

router.get(
    "/today",
    ensureAuth,
    getTodayDigest
);

module.exports =
router;