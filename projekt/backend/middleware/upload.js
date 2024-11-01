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

// Filtr plików – dopuszcza tylko obrazy
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true); // Jeśli typ pliku jest poprawny, akceptujemy plik
  } else {
    cb(
      new Error(
        "Tylko obrazy są dozwolone. Proszę wybrać plik o rozszerzeniu JPEG, JPG, PNG lub GIF."
      )
    ); // Jeśli nie, odrzucamy
  }
};

// Inicjalizacja multer z konfiguracją storage i filtrem plików
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksymalny rozmiar pliku 5MB
  },
});

module.exports = upload;
