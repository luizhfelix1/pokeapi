const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco de dados SQLite (em memória)
let db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run('CREATE TABLE searches (pokemon_name TEXT, count INTEGER)');
});

// Rota para registrar uma pesquisa
app.post('/search', (req, res) => {
    const pokemonName = req.body.pokemon_name.toLowerCase();

    db.get('SELECT count FROM searches WHERE pokemon_name = ?', [pokemonName], (err, row) => {
        if (row) {
            db.run('UPDATE searches SET count = count + 1 WHERE pokemon_name = ?', [pokemonName]);
        } else {
            db.run('INSERT INTO searches (pokemon_name, count) VALUES (?, 1)', [pokemonName]);
        }
        res.sendStatus(200);
    });
});

// Rota para obter os top 10 Pokémon mais pesquisados
app.get('/top10', (req, res) => {
    db.all('SELECT pokemon_name, count FROM searches ORDER BY count DESC LIMIT 10', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
