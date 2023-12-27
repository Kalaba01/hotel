const express = require("express");
const router = express.Router();

const dostupnostController = require("../controllers/dostupnostController");

router.get("/", dostupnostController.dostupnost);
router.post("/rezultat", dostupnostController.dostupnostRezultat);

module.exports = router;