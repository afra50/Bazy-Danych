const db = require("../models/db");

// Tworzenie nowej rezerwacji
exports.createReservation = (req, res) => {
  const { id_domku, start, end, name, email, phone } = req.body;

  // Sprawdzenie wymaganych pól
  if (!id_domku || !start || !end || !name || !email || !phone) {
    return res.status(400).json({ error: "Wszystkie pola są wymagane." });
  }

  // Wstawienie nowej rezerwacji do bazy danych
  const sql = `
    INSERT INTO rezerwacje (id_domku, data_od, data_do, imie, email, telefon, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Oczekująca')
  `;

  db.query(sql, [id_domku, start, end, name, email, phone], (err, result) => {
    if (err) {
      console.error("Błąd podczas składania rezerwacji:", err);
      return res.status(500).json({ error: "Błąd serwera." });
    }

    res.status(201).json({ message: "Rezerwacja została pomyślnie złożona." });
  });
};

// Pobieranie rezerwacji dla danego domku
exports.getReservationsForHouse = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT * FROM rezerwacje 
    WHERE id_domku = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Błąd podczas pobierania rezerwacji:", err);
      return res.status(500).json({ error: "Błąd serwera." });
    }

    res.status(200).json(results);
  });
};
