const express = require("express");
const router = express.Router();
const housesController = require("../controllers/housesController");

router.get("/:id", housesController.getHouseById);
router.get("/:id/images", housesController.getHouseImages);
router.get("/:id/availability", housesController.getHouseAvailability);
router.get("/:id/owner", housesController.getOwnerDetails);

module.exports = router;

module.exports = router;
