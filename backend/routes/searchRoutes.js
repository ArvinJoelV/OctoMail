const router = require("express").Router();
const ensureAuth = require("../middleware/authMiddleware");
const {semanticSearch, getSimilarEmails} = require("../controllers/searchController");

router.post("/semantic",ensureAuth,semanticSearch );
router.get("/:id/similar",ensureAuth,getSimilarEmails);
module.exports= router;