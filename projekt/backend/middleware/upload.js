const multer = require("multer");
const path = require("path");

// Konfiguracja storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ownerId = req.params.id; // Pobieramy ownerId z parametrów
    const extension = path.extname(file.originalname); // Zachowujemy rozszerzenie oryginalnego pliku
    cb(null, `owner_${ownerId}${extension}`); // Nazwa pliku oparta na ownerId
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
