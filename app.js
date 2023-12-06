const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node-app',
});$

const a =2;

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données : ' + err.stack);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

  db.query(query, (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      // Utilisateur authentifié, rediriger vers la page de réussite
      res.sendFile(__dirname + '/success.html');
    } else {
      // Échec d'authentification, rediriger vers la page d'échec
      res.sendFile(__dirname + '/failure.html');
    }
  });
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  const query = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${password}')`;

  db.query(query, (err, result) => {
    if (err) throw err;

    // Rediriger vers la page de succès après l'enregistrement
    res.sendFile(__dirname + '/register-success.html');
  });
});

// Nouvelle route GET pour récupérer tous les utilisateurs
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';

  db.query(query, (err, result) => {
    if (err) throw err;

    res.json(result);
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
