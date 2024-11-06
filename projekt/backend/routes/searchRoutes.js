const express = require("express");
const router = express.Router();
const { searchDomki } = require("../controllers/searchController");

router.post("/", searchDomki);

module.exports = router;
