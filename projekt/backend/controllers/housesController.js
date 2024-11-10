const db = require("../models/db");
const path = require("path");
const fs = require("fs");

// Pobieranie domku
exports.getHouseById = (req, res) => {
  const houseId = req.params.id;
  const sql = `SELECT * FROM domki WHERE id_domku = ?`;

  db.query(sql, [houseId], (err, result) => {
    if (err) {
      console.error("Błąd przy pobieraniu domku:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Domek nie znaleziony" });
    }

    res.status(200).json(result[0]);
  });
};

// Pobieranie liczby zdjęć
exports.getHouseImages = (req, res) => {
  const houseId = req.params.id;
  const imageDir = path.join(__dirname, "..", "domki", houseId);

  if (!fs.existsSync(imageDir)) {
    return res.status(404).json({ error: "Folder z obrazami nie znaleziony" });
  }

  fs.readdir(imageDir, (err, files) => {
    if (err) {
      console.error("Błąd podczas odczytu folderu:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    const images = files
      .filter((file) => /\.(jpg|jpeg|png|gif)$/.test(file))
      .map((file) => `http://localhost:5000/domki/${houseId}/${file}`);

    res.status(200).json(images);
  });
};
