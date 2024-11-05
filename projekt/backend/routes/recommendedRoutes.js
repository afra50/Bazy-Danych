const express = require("express");
const router = express.Router();
const { getPolecaneDomki } = require("../controllers/recommendedController");

router.get("/", getPolecaneDomki);

module.exports = router;
