// controllers/authController.js
const bcrypt = require("bcrypt");
const db = require("../models/db");

// Rejestracja
exports.register = async (req, res) => {
  const { imie, nazwisko, telefon, email, haslo } = req.body;

  // Walidacja pól
  if (!imie || !nazwisko || !telefon || !email || !haslo) {
    return res.status(400).send("Wszystkie pola są wymagane");
  }

  try {
    // Sprawdzenie, czy użytkownik o podanym adresie e-mail już istnieje
    const checkEmailSql = `SELECT * FROM klienci WHERE email = ?`;
    db.query(checkEmailSql, [email], async (err, results) => {
      if (err) {
        console.error("Błąd podczas sprawdzania adresu e-mail:", err);
        return res.status(500).send("Błąd serwera");
      }

      if (results.length > 0) {
        return res.status(409).send("Konto z tym adresem e-mail już istnieje");
      }

      const hashedPassword = await bcrypt.hash(haslo, 10);

      const sql = `INSERT INTO klienci (imie, nazwisko, telefon, email, haslo, data_rejestracji) VALUES (?, ?, ?, ?, ?, NOW())`;
      db.query(
        sql,
        [imie, nazwisko, telefon, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("Błąd podczas wstawiania danych:", err);
            return res.status(500).send("Błąd serwera");
          }

          res.status(201).send("Rejestracja zakończona sukcesem");
        }
      );
    });
  } catch (error) {
    console.error("Błąd podczas szyfrowania hasła:", error);
    res.status(500).send("Błąd serwera podczas rejestracji");
  }
};

// Logowanie klienta
exports.login = (req, res) => {
  const { email, haslo } = req.body;

  if (!email || !haslo) {
    return res.status(400).send("E-mail i hasło są wymagane");
  }

  // Sprawdzenie, czy użytkownik istnieje w bazie danych
  const sql = `SELECT * FROM klienci WHERE email = ?`;
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Błąd podczas pobierania danych:", err);
      return res.status(500).send("Błąd serwera");
    }

    if (results.length === 0) {
      return res.status(401).send("Błędne hasło lub e-mail");
    }

    const user = results[0];

    // Porównanie hasła
    const isMatch = await bcrypt.compare(haslo, user.haslo);
    if (!isMatch) {
      return res.status(401).send("Błędne hasło lub e-mail");
    }

    const { haslo: _, ...userData } = user;

    res.status(200).json({
      id_klienta: userData.id_klienta,
      imie: userData.imie,
      nazwisko: userData.nazwisko,
      email: userData.email,
      telefon: userData.telefon,
    });
  });
};

// Logowanie właściciela
exports.loginOwner = (req, res) => {
  const { email, haslo } = req.body;

  if (!email || !haslo) {
    return res.status(400).json({ error: "E-mail i hasło są wymagane" });
  }

  // Sprawdzenie, czy właściciel istnieje w bazie danych
  const sql = `SELECT * FROM wlasciciele WHERE email = ?`;
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Błąd podczas pobierania danych:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Błędne hasło lub e-mail" });
    }

    const owner = results[0];

    // Porównanie zaszyfrowanego hasła
    const isMatch = await bcrypt.compare(haslo, owner.haslo);
    if (!isMatch) {
      return res.status(401).json({ error: "Błędne hasło lub e-mail" });
    }

    res.status(200).json({
      message: "Zalogowano pomyślnie jako właściciel",
      id_wlasciciela: owner.id_wlasciciela,
      imie: owner.imie,
      nazwisko: owner.nazwisko,
      email: owner.email,
    });
  });
};

// Zmiana hasła właściciela
exports.changeOwnerPassword = (req, res) => {
  const { ownerId, currentPassword, newPassword } = req.body;

  // Walidacja danych wejściowych
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Wszystkie pola są wymagane" });
  }

  // Pobranie bieżącego zaszyfrowanego hasła właściciela z bazy
  const sql = `SELECT haslo FROM wlasciciele WHERE id_wlasciciela = ?`;
  db.query(sql, [ownerId], async (err, results) => {
    if (err) {
      console.error("Błąd podczas pobierania danych właściciela:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Właściciel nie istnieje" });
    }

    const owner = results[0];

    // Sprawdzenie bieżącego zaszyfrowanego hasła
    const isMatch = await bcrypt.compare(currentPassword, owner.haslo);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Bieżące hasło jest nieprawidłowe" });
    }

    // Zaszyfrowanie nowego hasła
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Zaktualizowanie hasła w bazie danych
    const updateSql = `UPDATE wlasciciele SET haslo = ? WHERE id_wlasciciela = ?`;
    db.query(updateSql, [hashedPassword, ownerId], (err, result) => {
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
