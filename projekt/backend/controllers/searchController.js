// searchController.js
const db = require("../models/db");

const searchDomki = (req, res) => {
  let {
    dateRange,
    location,
    guests,
    categories,
    sort,
    page = 1,
    limit = 9,
  } = req.body;

  // Konwersja 'page' i 'limit' na liczby całkowite
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  const offset = (page - 1) * limit;

  // Destrukturyzacja zakresu dat
  const [startDate, endDate] = dateRange;

  // Budowanie podstawy zapytania SQL
  let baseQuery = "FROM domki d WHERE d.liczba_osob >= ?";
  const params = [guests];

  if (location) {
    baseQuery += " AND d.lokalizacja LIKE ?";
    params.push(`%${location}%`);
  }

  if (categories && categories.length > 0) {
    const placeholders = categories.map(() => "?").join(",");
    baseQuery += ` AND d.kategoria IN (${placeholders})`;
    params.push(...categories);
  }

  if (startDate && endDate) {
    baseQuery += `
      AND d.id_domku NOT IN (
        SELECT dd.id_domku FROM dostepnosc_domkow dd
        WHERE dd.id_domku = d.id_domku
          AND dd.data_od <= ?
          AND dd.data_do >= ?
      )
      AND d.id_domku NOT IN (
        SELECT r.id_domku FROM rezerwacje r
        WHERE r.id_domku = d.id_domku
          AND (
            r.data_od <= ?
            AND r.data_do >= ?
          )
      )
    `;
    // Dodanie parametrów dla obu podzapytań
    params.push(
      endDate,
      startDate, // dla dostepnosc_domku
      endDate,
      startDate // dla rezerwacje
    );
  }

  // Definicja klauzuli ORDER BY na podstawie parametru sort
  let orderByClause = "ORDER BY RAND()"; // Domyślne sortowanie losowe

  if (sort) {
    switch (sort) {
      case "price_asc":
        orderByClause = "ORDER BY d.cena_za_noc ASC";
        break;
      case "price_desc":
        orderByClause = "ORDER BY d.cena_za_noc DESC";
        break;
      case "most_relevant":
        // Zakładamy, że masz pole 'recommended' typu BOOLEAN lub podobne
        orderByClause = "ORDER BY d.polecany DESC, RAND()";
        break;
      default:
        orderByClause = "ORDER BY RAND()";
    }
  }

  // Zapytanie o łączną liczbę wyników
  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;

  db.query(countQuery, params, (err, countResults) => {
    if (err) {
      console.error("Błąd przy zliczaniu domków:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }
    const total = countResults[0].total;

    // Zapytanie o wyniki z paginacją i sortowaniem
    const dataQuery = `SELECT d.* ${baseQuery} ${orderByClause} LIMIT ? OFFSET ?`;
    const dataParams = [...params, limit, offset];

    db.query(dataQuery, dataParams, (err, dataResults) => {
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
