const mysql = require('mysql2');
const config = require("../config/baza")
const pool = mysql.createPool(config);

const csv = require('csv-parser');
const multer = require('multer');
const stream = require('stream');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const izbor = (req, res) => {
  res.render("cijene/cijene");
};

const datum = (req, res) => {
  res.render("cijene/cijene-datum");
};

const rezultat = async (req, res) => {
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
        connection.query('CALL cijene(?)', datum, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      const result = result1[0];

      res.render("cijene/cijene-rezultat", { listaRezultat: result });
    } catch (err){
      console.log("Greska prilikom izvrsavanja upita", err);
    }
  } catch (err) {
    console.log('Greška prilikom povezivanja sa bazom podataka:', err);
  } finally {
    if (connection) connection.release();
  }
};

const predlog = (req, res) => {
  res.render("cijene/cijene-predlog");
}

const uploadFajlova = upload.fields([
  { name: 'cjenovnik', maxCount: 1 },
  { name: 'stavke', maxCount: 1 }
]);

const procitajCSVFajl = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      reject(new Error('File buffer is undefined or null.'));
      return;
    }
    const data = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    bufferStream.pipe(csv())
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', () => {
          resolve(data);
        })
        .on('error', (error) => {
          reject(error);
        });
  });
};

const sacuvajUBazi = async (cjenovnikData, stavkeData) => {
  let connection;
  try {
    connection = await pool.promise().getConnection();

    const [zaglavljeQuery] = await connection.query('INSERT INTO zaglavlje_cijenovnika (pocetni_datum, krajnji_datum, napomena) VALUES (?, ?, ?)', [cjenovnikData[0].pocetni_datum, cjenovnikData[0].krajnji_datum, cjenovnikData[0].napomena]);

    const [stavkeQuery] = await connection.query('INSERT INTO stavke_cijenovnika (cijena, tip_sobe, tip_smjestaja, zaglavlje_id) VALUES (?, ?, ?, LAST_INSERT_ID())', [stavkeData[0].cijena, stavkeData[0].tip_sobe, stavkeData[0].tip_smjestaja]);

    await connection.commit();
    connection.release();

    console.log('Podaci uspešno sačuvani u bazi.');
  } catch (error) {
    console.error('Greška pri čuvanju u bazi:', error);

    if (connection) {
      await connection.rollback();
      connection.release();
    }
  }
};


const obradiFajlove = async (req, res) => {
  try {
    const cjenovnikFile = req.files['cjenovnik'][0];
    const stavkeFile = req.files['stavke'][0];

    if (!cjenovnikFile || !stavkeFile) {
      return res.status(400).json({ error: 'Nisu pronađeni potrebni fajlovi.' });
    }

    const cjenovnikData = await procitajCSVFajl(cjenovnikFile.buffer);
    const stavkeData = await procitajCSVFajl(stavkeFile.buffer);

    await sacuvajUBazi(cjenovnikData, stavkeData);

    res.status(200).json({ message: 'Fajlovi uspešno uploadovani i podaci sačuvani u bazi.' });
  } catch (error) {
    console.error('Greška pri obradi fajlova:', error);
    res.status(500).json({ error: 'Došlo je do greške pri obradi fajlova.' });
  }
};

const poruka = (req, res) => {
  res.render("cijene/cijene-poruka");
}

module.exports = {izbor, datum, rezultat, predlog, uploadFajlova, obradiFajlove, poruka};
