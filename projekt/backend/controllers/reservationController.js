// controllers/reservationController.js

const db = require("../models/db");

// Tworzenie nowej rezerwacji
exports.createReservation = (req, res) => {
  const { id_domku, id_klienta, start, end } = req.body;

  // Sprawdzenie wymaganych pól
  if (!id_domku || !id_klienta || !start || !end) {
    return res.status(400).json({ error: "Wszystkie pola są wymagane." });
  }

  const data_od = new Date(start);
  const data_do = new Date(end);

  // Walidacja dat
  if (data_do <= data_od) {
    return res
      .status(400)
      .json({ error: "Data końcowa musi być późniejsza niż data początkowa." });
  }

  // Walidacja, czy data_od nie jest w przeszłości
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ustawienie godziny na 00:00

  if (data_od < today) {
    return res
      .status(400)
      .json({ error: "Data wyjazdu nie może być w przeszłości." });
  }

  // Sprawdzenie dostępności domku w wybranym przedziale dat
  const availabilitySql = `
    SELECT * FROM rezerwacje 
    WHERE id_domku = ? AND (
      (data_od <= ? AND data_do > ?) OR
      (data_od < ? AND data_do >= ?) OR
      (data_od >= ? AND data_do <= ?)
    )
  `;

  db.query(
    availabilitySql,
    [id_domku, data_od, data_od, data_do, data_do, data_od, data_do],
    (err, results) => {
      if (err) {
        console.error("Błąd podczas sprawdzania dostępności domku:", err);
        return res.status(500).json({ error: "Błąd serwera." });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "Domek jest niedostępny w wybranym okresie." });
      }

      // Wstawienie nowej rezerwacji do bazy danych
      const insertSql = `
        INSERT INTO rezerwacje (id_domku, id_klienta, data_od, data_do, status)
        VALUES (?, ?, ?, ?, 'Oczekująca')
      `;

      db.query(
        insertSql,
        [id_domku, id_klienta, data_od, data_do],
        (err, result) => {
          if (err) {
            console.error("Błąd podczas składania rezerwacji:", err);
            return res.status(500).json({ error: "Błąd serwera." });
          }

          res.status(201).json({
            message: "Rezerwacja została pomyślnie złożona.",
            id_rezerwacji: result.insertId,
          });
        }
      );
    }
  );
};

// Pobieranie rezerwacji dla danego domku
exports.getReservationsForHouse = (req, res) => {
  const { id } = req.params; // id_domku

  const sql = "SELECT * FROM rezerwacje WHERE id_domku = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Błąd podczas pobierania rezerwacji:", err);
      return res.status(500).json({ error: "Błąd serwera." });
    }

    res.status(200).json(results);
  });
};
// Usuwanie rezerwacji
exports.deleteReservation = (req, res) => {
  const { id_rezerwacji } = req.params; // Pobranie id rezerwacji z parametru URL

  // Logowanie ID, żeby upewnić się, że jest poprawne
  console.log("Usuwanie rezerwacji o ID:", id_rezerwacji);

  // Sprawdzenie, czy rezerwacja istnieje
  const sqlCheck = `SELECT * FROM rezerwacje WHERE id_rezerwacji = ?`;
  db.query(sqlCheck, [id_rezerwacji], (err, results) => {
    if (err) {
      console.error("Błąd podczas sprawdzania rezerwacji:", err);
      return res.status(500).json({ error: "Błąd serwera." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Rezerwacja nie istnieje." });
    }

    // Usuwanie rezerwacji z bazy danych
    const sqlDelete = `DELETE FROM rezerwacje WHERE id_rezerwacji = ?`;
    db.query(sqlDelete, [id_rezerwacji], (err, result) => {
      if (err) {
        console.error("Błąd podczas usuwania rezerwacji:", err);
        return res.status(500).json({ error: "Błąd serwera podczas usuwania rezerwacji." });
      }

      res.status(200).json({ message: "Rezerwacja została anulowana." });
    });
  });
};