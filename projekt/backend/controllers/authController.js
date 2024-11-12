// controllers/authController.js
const bcrypt = require("bcrypt");
const db = require("../models/db");

// controllers/authController.js
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
        return res.status(409).send("Konto z tym adresem e-mail już istnieje"); // Kod 409 dla konfliktu
      }

      // Szyfrowanie hasła
      const hashedPassword = await bcrypt.hash(haslo, 10);

      // Zapytanie SQL do dodania klienta
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

  // Walidacja pól
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
      return res
        .status(400)
        .send("Nie znaleziono użytkownika o podanym adresie e-mail");
    }

    const user = results[0];

    // Porównanie hasła
    const isMatch = await bcrypt.compare(haslo, user.haslo);
    if (!isMatch) {
      return res.status(400).send("Błędne hasło");
    }

    res.status(200).send("Zalogowano pomyślnie");
  });
};

// Logowanie właściciela
exports.loginOwner = (req, res) => {
  const { email, haslo } = req.body;

  // Walidacja pól
  if (!email || !haslo) {
    return res.status(400).json({ error: "E-mail i hasło są wymagane" });
  }

  // Sprawdzenie, czy właściciel istnieje w bazie danych
  const sql = `SELECT * FROM wlasciciele WHERE email = ?`;
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Błąd podczas pobierania danych:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    if (results.length === 0) {
      return res
        .status(400)
        .json({ error: "Nie znaleziono właściciela o podanym adresie e-mail" });
    }

    const owner = results[0];

    // Porównanie hasła (bez szyfrowania)
    if (haslo !== owner.haslo) {
      return res.status(400).json({ error: "Błędne hasło" });
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
