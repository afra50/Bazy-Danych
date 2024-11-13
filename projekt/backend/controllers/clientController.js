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
