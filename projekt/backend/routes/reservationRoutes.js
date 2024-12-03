const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");

// Tworzenie nowej rezerwacji
router.post("/reservations", reservationController.createReservation);

// Pobieranie rezerwacji dla danego domku
router.get("/reservations/:id", reservationController.getReservationsForHouse);
router.delete("/reservations/:id_rezerwacji", reservationController.deleteReservation);

module.exports = router;
