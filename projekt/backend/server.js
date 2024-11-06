// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Import tras
const authRoutes = require("./routes/authRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const recommendedRoutes = require("./routes/recommendedRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serwowanie statycznych plików uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serwowanie statycznych plików domki
app.use("/domki", express.static(path.join(__dirname, "domki")));

// Użycie tras
app.use("/api/auth", authRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/recommended", recommendedRoutes);
app.use("/api/search", searchRoutes);

// Obsługa błędów multer
app.use((err, req, res, next) => {
  if (
    err instanceof multer.MulterError ||
    err.message === "Tylko obrazy są dozwolone"
  ) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
