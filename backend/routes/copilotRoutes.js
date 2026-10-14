const router =require("express").Router();
const ensureAuth =require("../middleware/authMiddleware");
const {askCopilot, clearChat} = require("../controllers/copilotController");

router.post("/ask",ensureAuth,askCopilot);
router.delete("/clear",ensureAuth,clearChat);
module.exports = router;