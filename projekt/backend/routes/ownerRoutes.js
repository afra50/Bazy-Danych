const express = require("express");
const multer = require("multer");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const upload = require("../middleware/upload");

// Endpointy właściciela
router.get("/profile/:id", ownerController.getOwnerProfile);
router.put("/profile/:id", ownerController.updateOwnerDescription);
router.put("/profile/update/:id", ownerController.updateOwnerData);

// Obsługa przesyłania zdjęcia z weryfikacją błędów
router.post("/upload/:id", (req, res) => {
  // Użyj multer z konfiguracją upload.single i przechwyć błędy
  upload.single("zdjecie")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Obsługa błędów multer (np. przekroczony limit rozmiaru)
      return res
        .status(400)
        .json({ error: "Przekroczono maksymalny rozmiar pliku 5MB." });
    } else if (err) {
      // Obsługa błędów fileFilter lub innych
      return res.status(400).json({ error: err.message });
    }
    // Kontynuuj z kontrolerem, jeśli nie ma błędów
    ownerController.uploadOwnerPhoto(req, res);
  });
});

module.exports = router;
