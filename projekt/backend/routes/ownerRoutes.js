// routes/ownerRoutes.js
const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const upload = require("../middleware/upload");

// Endpointy właściciela
router.get("/profile/:id", ownerController.getOwnerProfile);
router.put("/profile/:id", ownerController.updateOwnerDescription);
router.put("/profile/update/:id", ownerController.updateOwnerData);
router.post(
  "/upload/:id",
  upload.single("zdjecie"),
  ownerController.uploadOwnerPhoto
);

module.exports = router;
