const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

app.use(express.json());

// Connexion à PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: 5432,
  database: 'projetcloud',
  user: 'admin',
  password: 'admin123',
});

// Routes de base
app.get('/', (req, res) => {
  res.json({ service: 'users', status: 'running' });
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/users', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
      [email, password, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour le login (simplifiée)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Pour l'instant, simple vérification
  res.json({ 
    message: 'Login endpoint', 
    email: email,
    token: 'fake-jwt-token' 
  });
});

app.listen(port, () => {
  console.log(`Users service listening on port ${port}`);
});