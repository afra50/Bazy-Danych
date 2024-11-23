// controllers/clientController.js
const bcrypt = require("bcrypt");
const db = require("../models/db");

// Pobieranie danych klienta na podstawie ID
exports.getClientById = (req, res) => {
  const clientId = req.params.id;

  const sql = `
    SELECT imie, nazwisko, email, telefon 
    FROM klienci
    WHERE id_klienta = ?
  `;

  db.query(sql, [clientId], (err, results) => {
    if (err) {
      console.error("Błąd podczas pobierania danych klienta:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Klient nie znaleziony" });
    }

    res.status(200).json(results[0]);
  });
};

// Pobieranie rezerwacji klienta na podstawie ID
exports.getReservationsForClient = (req, res) => {
  const clientId = req.params.id;

  const sql = `
    SELECT 
      rezerwacje.id_rezerwacji,
      rezerwacje.id_domku,
      rezerwacje.data_od,
      rezerwacje.data_do,
      rezerwacje.status,
      rezerwacje.data_dokonania_rezerwacji,
      rezerwacje.data_potwierdzenia,
      domki.nazwa AS nazwa_domku,
      domki.zdjecie AS zdjecie_domku
    FROM rezerwacje
    JOIN domki ON rezerwacje.id_domku = domki.id_domku
    WHERE rezerwacje.id_klienta = ?
  `;

  db.query(sql, [clientId], (err, results) => {
    if (err) {
      console.error("Błąd podczas pobierania rezerwacji klienta:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    res.status(200).json(results);
  });
};

// Zmiana hasła klienta
exports.changeClientPassword = (req, res) => {
  const { clientId, currentPassword, newPassword } = req.body;

  // Walidacja danych wejściowych
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Wszystkie pola są wymagane" });
  }

  // Pobranie bieżącego zaszyfrowanego hasła klienta z bazy
  const sql = `SELECT haslo FROM klienci WHERE id_klienta = ?`;
  db.query(sql, [clientId], async (err, results) => {
    if (err) {
      console.error("Błąd podczas pobierania danych klienta:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Klient nie istnieje" });
    }

    const client = results[0];

    // Sprawdzenie bieżącego zaszyfrowanego hasła
    const isMatch = await bcrypt.compare(currentPassword, client.haslo);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Bieżące hasło jest nieprawidłowe" });
    }

    // Zaszyfrowanie nowego hasła
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Zaktualizowanie hasła w bazie danych
    const updateSql = `UPDATE klienci SET haslo = ? WHERE id_klienta = ?`;
    db.query(updateSql, [hashedPassword, clientId], (err, result) => {
      if (err) {
        console.error("Błąd podczas aktualizowania hasła:", err);
        return res
          .status(500)
          .json({ error: "Błąd serwera podczas aktualizacji hasła" });
      }

      res.status(200).json({ message: "Hasło zostało pomyślnie zmienione" });
    });
  });
};

// Aktualizacja danych klienta
exports.updateClientData = (req, res) => {
  const clientId = req.params.id;
  const { imie, nazwisko, email, telefon } = req.body;

  // Walidacja danych wejściowych
  if (!imie || !nazwisko || !email || !telefon) {
    return res.status(400).json({ error: "Wszystkie pola są wymagane" });
  }

  const sql = `UPDATE klienci SET imie = ?, nazwisko = ?, email = ?, telefon = ? WHERE id_klienta = ?`;
  db.query(sql, [imie, nazwisko, email, telefon, clientId], (err, result) => {
    if (err) {
      console.error("Błąd podczas aktualizacji danych klienta:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    res.status(200).json({ message: "Dane zostały pomyślnie zaktualizowane" });
  });
};

// Usuwanie konta klienta
exports.deleteClientAccount = (req, res) => {
  const { clientId, password } = req.body;

  if (!clientId || !password) {
    return res.status(400).json({ error: "ID klienta i hasło są wymagane" });
  }

  // Pobranie zaszyfrowanego hasła klienta
  const sqlGetPassword = `SELECT haslo FROM klienci WHERE id_klienta = ?`;
  db.query(sqlGetPassword, [clientId], async (err, results) => {
    if (err) {
      console.error("Błąd podczas pobierania hasła klienta:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Klient nie istnieje" });
    }

    const client = results[0];

    // Sprawdzenie poprawności hasła
    const isMatch = await bcrypt.compare(password, client.haslo);
    if (!isMatch) {
      return res.status(401).json({ error: "Podane hasło jest nieprawidłowe" });
    }

    // Usunięcie klienta
    const sqlDeleteClient = `DELETE FROM klienci WHERE id_klienta = ?`;
    db.query(sqlDeleteClient, [clientId], (err, result) => {
      if (err) {
        console.error("Błąd podczas usuwania konta klienta:", err);
        return res
          .status(500)
          .json({ error: "Błąd serwera podczas usuwania konta" });
      }

      res.status(200).json({ message: "Konto klienta zostało usunięte" });
    });
  });
};
