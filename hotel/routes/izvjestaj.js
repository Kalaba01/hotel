const express = require("express");
const router = express.Router();

const izvjestajController = require("../controllers/izvjestajController");

router.get("/", izvjestajController.izvjestaj);
router.post("/vrsta", izvjestajController.vrsta);
router.get("/brojGostijuPoMesecima", izvjestajController.brojGostijuPoMesecima);
router.get("/:izbor", izvjestajController.unos);

router.post("/unos/statusRezervacijeZaVrstuKupca", izvjestajController.statusRezervacijeZaVrstuKupca);
router.post("/unos/agencijaAlotman", izvjestajController.agencijaAlotman);
router.post("/unos/statusPoTipovimaSoba", izvjestajController.statusPoTipovimaSoba);
router.post("/unos/brojGostijuPoDrzavama", izvjestajController.brojGostijuPoDrzavama);
router.post("/unos/brojNocenjaPoDrzavama", izvjestajController.brojNocenjaPoDrzavama);
router.post("/unos/uporedniIzvjestaj", izvjestajController.uporedniIzvjestaj);

module.exports = router;
