const db = require("../models/db");

const searchDomki = (req, res) => {
  const { dateRange, location, guests, categories } = req.body;

  // Budowanie zapytania SQL na podstawie otrzymanych kryteriów
  let query = "SELECT * FROM domki WHERE liczba_osob >= ?";
  const params = [guests];

  if (location) {
    query += " AND lokalizacja LIKE ?";
    params.push(`%${location}%`);
  }

  if (categories && categories.length > 0) {
    query += " AND kategoria IN (?)";
    params.push(categories);
  }

  // Dodatkowe filtrowanie po dacie może wymagać złożonej logiki
  // np. sprawdzanie dostępności w określonym przedziale dat
  // Tutaj pozostawiam to jako prosty przykład

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Błąd przy wyszukiwaniu domków:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }
    res.json(results);
  });
};

module.exports = { searchDomki };
