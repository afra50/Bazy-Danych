const db = require("../models/db");

exports.getHouseById = (req, res) => {
  const houseId = req.params.id;
  const sql = `SELECT * FROM domki WHERE id_domku = ?`;

  db.query(sql, [houseId], (err, result) => {
    if (err) {
      console.error("Błąd przy pobieraniu domku:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Domek nie znaleziony" });
    }

    res.status(200).json(result[0]);
  });
};
