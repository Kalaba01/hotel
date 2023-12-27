const mysql = require('mysql2');
const config = require("../config/baza")
const pool = mysql.createPool(config);

const izvjestaj = (req, res) => {
    res.render("izvjestaj/izvjestaj-ponuda");
};

const vrsta = (req, res) => {
    const izbor = req.body.izbor;

    if (izbor === "brojGostijuPoMesecima") return res.redirect(`/izvjestaj/brojGostijuPoMesecima`);

    res.redirect(`/izvjestaj/${izbor}`);
};

const unos = (req, res) => {
    const izbor = req.params.izbor;

    if(izbor === "statusRezervacijeZaVrstuKupca") {
        res.render("izvjestaj/izvjestaj-forma-1", {ruta: "unos/statusRezervacijeZaVrstuKupca", naziv: "o statusu rezervacije", tekst: "Vrsta kupca:"});
    }
    else if(izbor === "agencijaAlotman") {
        res.render("izvjestaj/izvjestaj-forma-1", {ruta: "unos/agencijaAlotman", naziv: "o zauzetosti alotmana", tekst: "Datum:"});
    }
    else if(izbor === "statusPoTipovimaSoba") {
        res.render("izvjestaj/izvjestaj-forma-1", {ruta: "unos/statusPoTipovimaSoba", naziv: "o statusu soba", tekst: "Datum:"});
    }
    else if(izbor === "brojGostijuPoDrzavama") {
        res.render("izvjestaj/izvjestaj-forma-2", {ruta: "unos/brojGostijuPoDrzavama", naziv: "o broju gostiju"});
    }
    else if(izbor ===  "brojNocenjaPoDrzavama") {
        res.render("izvjestaj/izvjestaj-forma-2", {ruta: "unos/brojNocenjaPoDrzavama", naziv: "o broju nocenja"});
    }
    else {
        res.render("izvjestaj/izvjestaj-forma-4");
    }
};

const brojGostijuPoMesecima = async (req, res) => {
    let connection;

    try {
        connection = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(conn);
                }
            });
        });
        console.log('Povezan sa bazom podataka');

        try{
            const result1 = await new Promise((resolve, reject) => {
                connection.query('CALL brojGostijuPoMesecima()', (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            const result = result1[0];

            const konvertujMesec = (brojMeseca) => {
                const meseci = [
                    "januar", "februar", "mart", "april", "maj", "jun",
                    "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"
                ];
                return meseci[brojMeseca - 1] || "";
            };

            const rezultat = result.map(item => ({
                mjesec: konvertujMesec(item.mjesec),
                broj_gostiju: item.broj_gostiju
            }));
            res.render("izvjestaj/izvjestaj-rezultat-brojGostijuPoMesecima", { listaRezultat: rezultat, naslov: "Izvjestaj o broju gostiju" });
        } catch (err){
            console.log("Greska prilikom izvrsavanja upita", err);
        }
    } catch (err) {
        console.log('Greška prilikom povezivanja sa bazom podataka:', err);
    } finally {
        if (connection) connection.release();
    }
};

const statusRezervacijeZaVrstuKupca = async (req, res) => {
    const vrstaKupca = req.body.parametar;
    let connection;

    try {
        connection = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(conn);
                }
            });
        });
        console.log('Povezan sa bazom podataka');

        try{
            const result1 = await new Promise((resolve, reject) => {
                connection.query('CALL statusRezervacijeZaVrstukupca(?)', vrstaKupca, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            const result = result1[0];

            res.render("izvjestaj/izvjestaj-rezultat-statusRezervacijeZaVrstukupca", { listaRezultat: result, naslov: "Izvjestaj o statusu rezervacije" });
        } catch (err){
            console.log("Greska prilikom izvrsavanja upita", err);
        }
    } catch (err) {
        console.log('Greška prilikom povezivanja sa bazom podataka:', err);
    } finally {
        if (connection) connection.release();
    }
};

const agencijaAlotman = async (req, res) => {
    const datum = req.body.parametar;
    let connection;

    try {
        connection = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(conn);
                }
            });
        });
        console.log('Povezan sa bazom podataka');

        try{
            const result1 = await new Promise((resolve, reject) => {
                connection.query('CALL agencijaAlotman(?)', datum, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            const result = result1[0];

            res.render("izvjestaj/izvjestaj-rezultat-agencijaAlotman", { listaRezultat: result, naslov: "Izvjestaj o zauzetosti alotmana" });
        } catch (err){
            console.log("Greska prilikom izvrsavanja upita", err);
        }
    } catch (err) {
        console.log('Greška prilikom povezivanja sa bazom podataka:', err);
    } finally {
        if (connection) connection.release();
    }
};

const statusPoTipovimaSoba = async (req, res) => {
    const datum = req.body.parametar;
    let connection;

    try {
        connection = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(conn);
                }
            });
        });
        console.log('Povezan sa bazom podataka');

        try{
            const result1 = await new Promise((resolve, reject) => {
                connection.query('CALL statusPoTipovimaSoba(?)', datum, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            const result = result1[0];

            res.render("izvjestaj/izvjestaj-rezultat-statusPoTipovimaSoba", { listaRezultat: result, naslov: "Izvjestaj o statusu soba po broju lezaja" });
        } catch (err){
            console.log("Greska prilikom izvrsavanja upita", err);
        }
    } catch (err) {
        console.log('Greška prilikom povezivanja sa bazom podataka:', err);
    } finally {
        if (connection) connection.release();
    }
};

const brojGostijuPoDrzavama = async (req, res) => {
    const datum1 = req.body.parametar1;
    const datum2 = req.body.parametar2;
    let connection;

    try {
        connection = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(conn);
                }
            });
        });
        console.log('Povezan sa bazom podataka');

        try{
            const result1 = await new Promise((resolve, reject) => {
                connection.query('CALL brojGostijuPoDrzavama(?, ?)', [datum1, datum2], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            const result = result1[0];

            res.render("izvjestaj/izvjestaj-rezultat-brojGostijuPoDrzavama", { listaRezultat: result, naslov: "Izvjestaj o broju gostiju" });
        } catch (err){
            console.log("Greska prilikom izvrsavanja upita", err);
        }
    } catch (err) {
        console.log('Greška prilikom povezivanja sa bazom podataka:', err);
    } finally {
        if (connection) connection.release();
    }
};

const brojNocenjaPoDrzavama = async (req, res) => {
    const datum1 = req.body.parametar1;
    const datum2 = req.body.parametar2;
    let connection;

    try {
        connection = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(conn);
                }
            });
        });
        console.log('Povezan sa bazom podataka');

        try{
            const result1 = await new Promise((resolve, reject) => {
                connection.query('CALL brojNocenjaPoDrzavama(?, ?)', [datum1, datum2], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            const result = result1[0];

            res.render("izvjestaj/izvjestaj-rezultat-brojNocenjaPoDrzavama", { listaRezultat: result, naslov: "Izvjestaj o broju nocenja" });
        } catch (err){
            console.log("Greska prilikom izvrsavanja upita", err);
        }
    } catch (err) {
        console.log('Greška prilikom povezivanja sa bazom podataka:', err);
    } finally {
        if (connection) connection.release();
    }
};

const uporedniIzvjestaj = async (req, res) => {
    const datum1 = req.body.parametar1;
    const datum2 = req.body.parametar2;
    const datum3 = req.body.parametar3;
    const datum4 = req.body.parametar4;
    let connection;

    try {
        connection = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(conn);
                }
            });
        });
        console.log('Povezan sa bazom podataka');

        try{
            const result1 = await new Promise((resolve, reject) => {
                connection.query('CALL uporedniIzvjestaj(?, ?, ?, ?)', [datum1, datum2, datum3, datum4], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            const result = result1[0];

            res.render("izvjestaj/izvjestaj-rezultat-uporedniIzvjestaj", { listaRezultat: result});
        } catch (err){
            console.log("Greska prilikom izvrsavanja upita", err);
        }
    } catch (err) {
        console.log('Greška prilikom povezivanja sa bazom podataka:', err);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {izvjestaj, vrsta, unos, brojGostijuPoMesecima, statusRezervacijeZaVrstuKupca, agencijaAlotman, statusPoTipovimaSoba, brojGostijuPoDrzavama, brojNocenjaPoDrzavama, uporedniIzvjestaj};
