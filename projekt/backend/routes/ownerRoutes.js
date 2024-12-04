const express = require("express");
const multer = require("multer");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const upload = require("../middleware/upload");

// Endpointy właściciela
router.get("/profile/:id", ownerController.getOwnerProfile);
router.put("/profile/:id", ownerController.updateOwnerDescription);
router.put("/profile/update/:id", ownerController.updateOwnerData);
router.get(
  "/:ownerId/waiting-reservations",
  ownerController.getWaitingReservationsForOwner
);
router.get(
  "/:ownerId/confirmed-reservations",
  ownerController.getConfirmedReservationsForOwner
);
router.patch("/confirm-reservation/:id", ownerController.confirmReservation);
router.patch("/reject-reservation/:id", ownerController.rejectReservation);

// Obsługa przesyłania zdjęcia z weryfikacją błędów
router.post("/upload/:id", (req, res) => {
  upload.single("zdjecie")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ error: "Przekroczono maksymalny rozmiar pliku 5MB." });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    ownerController.uploadOwnerPhoto(req, res);
  });
});

module.exports = router;

router.post("/delete-owner-account", ownerController.deleteOwnerAccount);

router.get("/:ownerId/houses", ownerController.getHousesForOwner);
