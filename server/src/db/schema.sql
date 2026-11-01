import { Router } from 'express';
import { pool } from '../config/db.js';
import authRoutes from './auth.js';

const router = Router();

router.use('/auth', authRoutes);

router.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', timestamp: result.rows[0].now });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Banco PostgreSQL ainda não está configurado ou acessível.',
      detail: error.message,
    });
  }
});

router.get('/modules', (req, res) => {
  res.json({
    modules: [
      'overview',
      'pdv',
      'products',
      'clients',
      'deliveries',
      'employees',
      'payroll',
      'suppliers',
      'purchases',
      'cash',
      'sales',
      'finance',
      'expenses',
      'payables',
      'reports',
      'profitability',
      'integrations',
      'company',
      'receivables',
    ],
  });
});

export default router;
