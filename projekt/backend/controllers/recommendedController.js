const db = require("../models/db");

const getPolecaneDomki = (req, res) => {
  const query = "SELECT * FROM domki WHERE polecany = true";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Błąd przy pobieraniu polecanych domków:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }
    res.json(results);
  });
};

module.exports = { getPolecaneDomki };
