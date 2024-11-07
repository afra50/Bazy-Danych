const db = require("../models/db");

const searchDomki = (req, res) => {
  let {
    dateRange,
    location,
    guests,
    categories,
    page = 1,
    limit = 9,
  } = req.body;

  // Upewnij się, że 'page' i 'limit' są liczbami całkowitymi
  page = parseInt(page);
  limit = parseInt(limit);

  const offset = (page - 1) * limit;

  // Budowanie podstawy zapytania SQL
  let baseQuery = "FROM domki WHERE liczba_osob >= ?";
  const params = [guests];

  if (location) {
    baseQuery += " AND lokalizacja LIKE ?";
    params.push(`%${location}%`);
  }

  if (categories && categories.length > 0) {
    baseQuery += ` AND kategoria IN (${categories.map(() => "?").join(",")})`;
    params.push(...categories);
  }

  // Zapytanie o łączną liczbę wyników
  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;

  db.query(countQuery, params, (err, countResults) => {
    if (err) {
      console.error("Błąd przy zliczaniu domków:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }
    const total = countResults[0].total;

    // Zapytanie o wyniki z paginacją
    const dataQuery = `SELECT * ${baseQuery} LIMIT ${limit} OFFSET ${offset}`;

    db.query(dataQuery, params, (err, dataResults) => {
      if (err) {
        console.error("Błąd przy wyszukiwaniu domków:", err);
        return res.status(500).json({ error: "Błąd serwera" });
      }
      // Zwracamy łączną liczbę wyników i dane
      res.json({
        total,
        results: dataResults,
      });
    });
  });
};

module.exports = { searchDomki };
