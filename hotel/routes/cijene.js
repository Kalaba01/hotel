const express = require("express");
const router = express.Router();

const cijeneController = require("../controllers/cijeneController");

router.get("/", cijeneController.izbor);
router.get("/datum", cijeneController.datum);
router.post("/rezultat", cijeneController.rezultat)
router.get("/predlog", cijeneController.predlog);
router.post('/upload', cijeneController.uploadFajlova, cijeneController.obradiFajlove);
router.get("/predlog/poruka", cijeneController.poruka);

module.exports = router;
