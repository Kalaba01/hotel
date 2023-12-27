const mysql = require('mysql2');
const config = require("../config/baza")
const pool = mysql.createPool(config);

const alotman = (req, res) => {
        res.render("alotman/alotman");
};

const sacuvajZaglavlje = async (req, res) => {
    const jsonData = req.body;

    try {
        const connection = await pool.promise().getConnection();

        for (let i = 0; i < jsonData.zaglavlje_id.length; i++) {
            const zaglavljeId = jsonData.zaglavlje_id[i];
            const kupac = jsonData.kupac[i];
            const pocetniDatum = jsonData.pocetni_datum[i];
            const krajnjiDatum = jsonData.krajnji_datum[i];
            const status = jsonData.status[i];
            const napomena = jsonData.napomena[i];

            await connection.query('INSERT INTO zaglavlje_alotmana (zaglavlje_id, kupac, pocetni_datum, krajnji_datum, status, napomena) VALUES (?, ?, ?, ?, ?, ?)', [zaglavljeId, kupac, pocetniDatum, krajnjiDatum, status, napomena]);
        }
        connection.release();

        console.log('Podaci uspešno sačuvani u bazi.');
        res.status(200).send('Podaci su uspešno sačuvani u bazi.');
    } catch (err) {
        console.error('Greška pri čuvanju podataka u bazi:', err);
        res.status(500).send('Došlo je do greške pri čuvanju podataka u bazi.');
    }
};

const alotmanStavke = (req, res) => {
    res.render("alotman/alotman-stavke");
};

const sacuvajStavke = (req, res) => {
    const jsonData = req.body;

    console.log(jsonData);

    for (let i = 0; i < jsonData.stavke_id.length; i++) {
        const stavkeId = jsonData.stavke_id[i];
        const tipSobe = jsonData.tip_sobe[i];
        const brojSoba = jsonData.broj_soba[i];
        const zaglavljeId = jsonData.zaglavlje_id[i];

        const sql = 'INSERT INTO stavke_alotmana (stavke_id, tip_sobe, broj_soba, zaglavlje_id) VALUES (?, ?, ?, ?)';

        pool.query(sql, [stavkeId, tipSobe, brojSoba, zaglavljeId], (err, result) => {
            if (err) {
                console.error('Greška pri čuvanju podataka u bazi:', err);
                res.status(500).send('Došlo je do greške pri čuvanju podataka u bazi.');
            } else {
                console.log('Podaci uspešno sačuvani u bazi.');
                res.status(200).send('Podaci su uspešno sačuvani u bazi.');
            }
        });
    }
};

const alotmanPoruka = (req, res) => {
  res.render("alotman/alotman-poruka");
};

module.exports = {alotman, sacuvajZaglavlje, alotmanStavke, sacuvajStavke, alotmanPoruka};
