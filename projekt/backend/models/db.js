const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "95.215.232.175",
  port: process.env.DB_PORT || "3306",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "puqu-gute-luna",
  database: process.env.DB_NAME || "strona_z_rezerwacjami",
});

db.connect((err) => {
  if (err) {
    console.error("Błąd połączenia z bazą danych:", err);
  } else {
    console.log("Połączono z bazą danych MySQL");
  }
});

module.exports = db;
