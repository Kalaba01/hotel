const express = require("express");
const app = express();

const path = require('path');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Ruteri
const home = require("./routes/home");
const alotman = require("./routes/alotman");
const izvjestaj = require("./routes/izvjestaj");
const dostupnost = require("./routes/dostupnost");
const cijene = require("./routes/cijene");

//Rute
app.use("/", home);
app.use("/alotman", alotman);
app.use("/izvjestaj", izvjestaj)
app.use("/dostupnost", dostupnost);
app.use("/cijene", cijene);



app.listen(5000, (req, res) => {
    console.log("Server started");
});
