const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "puqu-gute-luna",
  database: "strona_z_rezerwacjami",
});

db.connect((err) => {
  if (err) {
    console.error("Błąd połączenia z bazą danych:", err);
  } else {
    console.log("Połączono z bazą danych MySQL");
  }
});

// Endpoint do obsługi rejestracji
app.post("/register", async (req, res) => {
  const { imie, nazwisko, telefon, email, haslo } = req.body;

  // Walidacja pól
  if (!imie || !nazwisko || !telefon || !email || !haslo) {
    return res.status(400).send("Wszystkie pola są wymagane");
  }

  try {
    // Szyfrowanie hasła
    const hashedPassword = await bcrypt.hash(haslo, 10); // 10 to liczba rund haszowania

    // Zapytanie SQL do dodania użytkownika
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
  } catch (error) {
    console.error("Błąd podczas szyfrowania hasła:", error);
    res.status(500).send("Błąd serwera podczas rejestracji");
  }
});

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
