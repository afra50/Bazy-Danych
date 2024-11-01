// middleware/upload.js
const multer = require("multer");
const path = require("path");

// Konfiguracja storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Filtr plików (opcjonalnie, np. tylko obrazy)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Tylko obrazy są dozwolone"));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
