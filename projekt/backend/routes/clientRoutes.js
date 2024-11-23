const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

router.get("/:id", clientController.getClientById);
router.get("/:id/reservations", clientController.getReservationsForClient);
router.post("/change-password", clientController.changeClientPassword);
router.put("/:id/update-data", clientController.updateClientData);
router.post("/delete-account", clientController.deleteClientAccount);

module.exports = router;
