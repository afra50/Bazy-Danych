const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

// Endpoint do pobierania danych klienta
router.get("/:id", clientController.getClientById);

module.exports = router;
