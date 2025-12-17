const express = require('express');
const { Pool } = require('pg');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = 3000;

app.use(express.json());

// PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: 5432,
  database: 'projetcloud',
  user: 'admin',
  password: 'admin123',
});

/* ======================
   Swagger configuration
   ====================== */

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Users API',
      version: '1.0.0',
      description: 'Microservice Users - Projet Cloud',
    },
    servers: [
      {
        url: '/',
      },
    ],
  },
  apis: ['./src/index.js'], // IMPORTANT
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ======================
   Routes
   ====================== */

app.get('/', (req, res) => {
  res.json({ service: 'users', status: 'running' });
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer la liste des utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
app.get('/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
app.post('/users', async (req, res) => {
  const { email, password, name } = req.body;
  const result = await pool.query(
    'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
    [email, password, name]
  );
  res.status(201).json(result.rows[0]);
});

app.post('/login', (req, res) => {
  res.json({ token: 'fake-jwt-token' });
});

app.listen(port, () => {
  console.log(`Users service listening on port ${port}`);
});
