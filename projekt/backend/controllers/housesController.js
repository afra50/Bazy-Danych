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

// Pobieranie dostępności domku
exports.getHouseAvailability = (req, res) => {
  const houseId = req.params.id;

  const sqlReservations = `
    SELECT data_od, data_do 
    FROM rezerwacje 
    WHERE id_domku = ? 
    AND status IN ('Potwierdzona', 'Oczekująca')
  `;
  const sqlUnavailable = `SELECT data_od, data_do FROM dostepnosc_domkow WHERE id_domku = ?`;

  // Pobieranie rezerwacji
  db.query(sqlReservations, [houseId], (err, reservations) => {
    if (err) {
      console.error("Błąd przy pobieraniu rezerwacji:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    // Pobieranie dodatkowej niedostępności
    db.query(sqlUnavailable, [houseId], (err, unavailable) => {
      if (err) {
        console.error("Błąd przy pobieraniu niedostępności:", err);
        return res.status(500).json({ error: "Błąd serwera" });
      }

      // Łączenie obu zestawów danych
      const allUnavailable = [...reservations, ...unavailable];

      res.status(200).json(allUnavailable);
    });
  });
};

// Pobieranie danych właściciela
exports.getOwnerDetails = (req, res) => {
  const houseId = req.params.id;

  const sql = `
    SELECT w.imie, w.opis, w.email, w.telefon, w.zdjecie 
    FROM wlasciciele w
    JOIN domki d ON d.id_wlasciciela = w.id_wlasciciela
    WHERE d.id_domku = ?`;

  db.query(sql, [houseId], (err, result) => {
    if (err) {
      console.error("Błąd przy pobieraniu danych właściciela:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Właściciel nie znaleziony" });
    }

    // Dodaj ścieżkę obrazu
    const owner = result[0];
    owner.zdjecie = `http://localhost:5000${owner.zdjecie}`;

    res.status(200).json(owner);
  });
};
