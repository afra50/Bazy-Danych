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

// Pobieranie rezerwacji o statusie "Oczekująca" dla domków danego właściciela
exports.getWaitingReservationsForOwner = (req, res) => {
  const ownerId = req.params.ownerId;

  const sql = `
    SELECT 
      rezerwacje.id_rezerwacji, 
      rezerwacje.data_od, 
      rezerwacje.data_do, 
      rezerwacje.data_dokonania_rezerwacji,
      domki.nazwa AS nazwa_domku,
      klienci.imie AS imie_klienta,
      klienci.nazwisko AS nazwisko_klienta,
      klienci.telefon AS telefon_klienta,
      klienci.email AS email_klienta
    FROM rezerwacje
    JOIN domki ON rezerwacje.id_domku = domki.id_domku
    JOIN klienci ON rezerwacje.id_klienta = klienci.id_klienta
    WHERE rezerwacje.status = 'Oczekująca' 
      AND domki.id_wlasciciela = ?
  `;

  db.query(sql, [ownerId], (err, results) => {
    if (err) {
      console.error("Błąd podczas pobierania rezerwacji:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    res.status(200).json(results);
  });
};

// Pobieranie rezerwacji o statusie "Potwierdzona" dla domków danego właściciela
exports.getConfirmedReservationsForOwner = (req, res) => {
  const ownerId = req.params.ownerId;

  const sql = `
    SELECT 
      rezerwacje.id_rezerwacji, 
      rezerwacje.data_od, 
      rezerwacje.data_do, 
      rezerwacje.data_dokonania_rezerwacji,
      rezerwacje.data_potwierdzenia,
      domki.nazwa AS nazwa_domku,
      klienci.imie AS imie_klienta,
      klienci.nazwisko AS nazwisko_klienta
    FROM rezerwacje
    JOIN domki ON rezerwacje.id_domku = domki.id_domku
    JOIN klienci ON rezerwacje.id_klienta = klienci.id_klienta
    WHERE rezerwacje.status = 'Potwierdzona' 
      AND domki.id_wlasciciela = ?
  `;

  db.query(sql, [ownerId], (err, results) => {
    if (err) {
      console.error("Błąd podczas pobierania rezerwacji:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    res.status(200).json(results);
  });
};

// Aktualizacja statusu rezerwacji na "Potwierdzona"
exports.confirmReservation = (req, res) => {
  const reservationId = req.params.id;
  const today = new Date().toISOString().slice(0, 10); // dzisiejsza data w formacie YYYY-MM-DD

  const sql = `
    UPDATE rezerwacje 
    SET status = 'Potwierdzona', data_potwierdzenia = ? 
    WHERE id_rezerwacji = ?`;

  db.query(sql, [today, reservationId], (err, result) => {
    if (err) {
      console.error("Błąd podczas potwierdzania rezerwacji:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Rezerwacja nie została znaleziona" });
    }
    res.status(200).json({ message: "Rezerwacja potwierdzona pomyślnie" });
  });
};

// Aktualizacja statusu rezerwacji na "Odrzucona"
exports.rejectReservation = (req, res) => {
  const reservationId = req.params.id;

  const sql = `
    UPDATE rezerwacje 
    SET status = 'Odrzucona'
    WHERE id_rezerwacji = ?`;

  db.query(sql, [reservationId], (err, result) => {
    if (err) {
      console.error("Błąd podczas odrzucania rezerwacji:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Rezerwacja nie została znaleziona" });
    }
    res.status(200).json({ message: "Rezerwacja potwierdzona pomyślnie" });
  });
};
