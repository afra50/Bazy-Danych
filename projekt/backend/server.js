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
  host: "95.215.232.175",
  port: "3306",
  user: "root",
  password: "puqu-gute-luna",
  database: "strona_z_rezerwacjami",
});

const path = require("path");
// Upewnij się, że katalog 'uploads' jest serwowany jako statyczny
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

db.connect((err) => {
  if (err) {
    console.error("Błąd połączenia z bazą danych:", err);
  } else {
    console.log("Połączono z bazą danych MySQL");
  }
});

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});

// Endpoint do obsługi rejestracji klientów
app.post("/register", async (req, res) => {
  const { imie, nazwisko, telefon, email, haslo } = req.body;

  // Walidacja pól
  if (!imie || !nazwisko || !telefon || !email || !haslo) {
    return res.status(400).send("Wszystkie pola są wymagane");
  }

  try {
    // Szyfrowanie hasła
    const hashedPassword = await bcrypt.hash(haslo, 10); // 10 to liczba rund haszowania

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
  } catch (error) {
    console.error("Błąd podczas szyfrowania hasła:", error);
    res.status(500).send("Błąd serwera podczas rejestracji");
  }
});

// Endpoint do logowania klientów (z szyfrowanym hasłem)
app.post("/login", (req, res) => {
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

    // Porównanie hasła wprowadzonego przez użytkownika z zaszyfrowanym hasłem w bazie danych
    const isMatch = await bcrypt.compare(haslo, user.haslo);
    if (!isMatch) {
      return res.status(400).send("Błędne hasło");
    }

    // Jeśli wszystko jest poprawne, zwróć sukces
    res.status(200).send("Zalogowano pomyślnie");
  });
});

// Endpoint do logowania właścicieli (bez szyfrowania hasła)
app.post("/login-owner", (req, res) => {
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

    // Porównanie hasła wprowadzonego przez właściciela z hasłem zapisanym w bazie danych (bez szyfrowania)
    if (haslo !== owner.haslo) {
      return res.status(400).json({ error: "Błędne hasło" });
    }

    // Zwrócenie danych właściciela, w tym jego ID, w formacie JSON
    res.status(200).json({
      message: "Zalogowano pomyślnie jako właściciel",
      id_wlasciciela: owner.id_wlasciciela,
      imie: owner.imie,
      nazwisko: owner.nazwisko,
      email: owner.email,
    });
  });
});

// Endpoint do pobierania danych właściciela
app.get("/owner/profile/:id", (req, res) => {
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
});

//Endpoint do aktualizacji opisu właściciela
app.put("/owner/profile/:id", (req, res) => {
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
});

const multer = require("multer");

// Konfiguracja multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Nazwa pliku na serwerze
  },
});

const upload = multer({ storage: storage });

// Endpoint do aktualizacji zdjęcia
app.post("/owner/upload/:id", upload.single("zdjecie"), (req, res) => {
  const ownerId = req.params.id;
  const zdjeciePath = `/uploads/${req.file.filename}`;

  const sql = `UPDATE wlasciciele SET zdjecie = ? WHERE id_wlasciciela = ?`;
  db.query(sql, [zdjeciePath, ownerId], (err, result) => {
    if (err) {
      console.error("Błąd podczas aktualizacji zdjęcia:", err);
      return res.status(500).send("Błąd serwera");
    }

    res.status(200).send("Zdjęcie zaktualizowane pomyślnie");
  });
});

// Endpoint do aktualizacji danych właściciela (imię, nazwisko, telefon, email)
app.put("/owner/profile/update/:id", (req, res) => {
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
});
