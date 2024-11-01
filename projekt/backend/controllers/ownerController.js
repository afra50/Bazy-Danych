const fs = require("fs");
const path = require("path");
const db = require("../models/db");

// Pobieranie profilu właściciela
exports.getOwnerProfile = (req, res) => {
  const ownerId = req.params.id;
  const sql = `SELECT imie, nazwisko, email, telefon, opis, zdjecie FROM wlasciciele WHERE id_wlasciciela = ?`;

  db.query(sql, [ownerId], (err, results) => {
    if (err) {
      console.error("Błąd podczas pobierania danych właściciela:", err);
      return res.status(500).send("Błąd serwera");
    }

    if (results.length === 0) {
      return res.status(404).send("Właściciel nie znaleziony");
    }

    res.status(200).json(results[0]);
  });
};

// Aktualizacja opisu właściciela
exports.updateOwnerDescription = (req, res) => {
  const ownerId = req.params.id;
  const { opis } = req.body;

  const sql = `UPDATE wlasciciele SET opis = ? WHERE id_wlasciciela = ?`;
  db.query(sql, [opis, ownerId], (err, result) => {
    if (err) {
      console.error("Błąd podczas aktualizacji opisu:", err);
      return res.status(500).send("Błąd serwera");
    }

    res.status(200).send("Opis zaktualizowany pomyślnie");
  });
};

// Aktualizacja danych właściciela
exports.updateOwnerData = (req, res) => {
  const ownerId = req.params.id;
  const { imie, nazwisko, telefon, email } = req.body;

  const sql = `UPDATE wlasciciele SET imie = ?, nazwisko = ?, telefon = ?, email = ? WHERE id_wlasciciela = ?`;
  db.query(sql, [imie, nazwisko, telefon, email, ownerId], (err, result) => {
    if (err) {
      console.error("Błąd podczas aktualizacji danych właściciela:", err);
      return res.status(500).send("Błąd serwera");
    }

    res.status(200).send("Dane właściciela zaktualizowane pomyślnie");
  });
};

// Aktualizacja zdjęcia właściciela z usunięciem poprzedniego
// Aktualizacja zdjęcia właściciela
exports.uploadOwnerPhoto = (req, res) => {
  const ownerId = req.params.id;
  const zdjeciePath = `/uploads/owner_${ownerId}${path.extname(
    req.file.originalname
  )}`;

  const sql = `UPDATE wlasciciele SET zdjecie = ? WHERE id_wlasciciela = ?`;
  db.query(sql, [zdjeciePath, ownerId], (err, result) => {
    if (err) {
      console.error("Błąd podczas aktualizacji zdjęcia:", err);
      return res.status(500).send("Błąd serwera");
    }

    res.status(200).send("Zdjęcie zaktualizowane pomyślnie");
  });
};
