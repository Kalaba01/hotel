const express = require("express");
const router = express.Router();

const alotmanController = require("../controllers/alotmanController");

router.get("/", alotmanController.alotman);
router.post("/sacuvaj-zaglavlje", alotmanController.sacuvajZaglavlje);
router.get("/stavke", alotmanController.alotmanStavke);
router.post("/sacuvaj-stavke", alotmanController.sacuvajStavke);
router.get("/poruka", alotmanController.alotmanPoruka);

module.exports = router;

