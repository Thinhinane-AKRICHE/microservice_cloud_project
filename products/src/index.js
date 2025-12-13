const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: 5432,
  database: 'projetcloud',
  user: 'admin',
  password: 'admin123',
});

app.get('/', (req, res) => {
  res.json({ service: 'products', status: 'running' });
});

app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Products service listening on port ${port}`);
});