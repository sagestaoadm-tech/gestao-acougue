import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    service: 'GESTÃO Açougue API',
    status: 'online',
    database: 'PostgreSQL configurado para integração futura',
  });
});

app.listen(port, async () => {
  try {
    await pool.query('SELECT 1');
    console.log(`Server running on http://localhost:${port}`);
    console.log('Database connection check: OK');
  } catch (error) {
    console.log('Database connection check: waiting for PostgreSQL configuration.');
    console.log(error.message);
  }
});
