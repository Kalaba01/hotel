const mysql = require('mysql2');
const config = require("../config/baza")
const pool = mysql.createPool(config);

const dostupnost = (req, res) => {
    res.render("dostupnost/dostupnost");
};

const dostupnostRezultat = async (req, res) => {
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
                connection.query('CALL dostupnostSoba(?)', datum, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            const result = result1[0];

            res.render("dostupnost/dostupnost-rezultat", { listaRezultat: result });
        } catch (err){
            console.log("Greska prilikom izvrsavanja upita", err);
        }
    } catch (err) {
        console.log('Greška prilikom povezivanja sa bazom podataka:', err);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {dostupnost, dostupnostRezultat};
