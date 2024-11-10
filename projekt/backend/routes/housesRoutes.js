const express = require("express");
const router = express.Router();
const housesController = require("../controllers/housesController");

router.get("/:id", housesController.getHouseById);

module.exports = router;
