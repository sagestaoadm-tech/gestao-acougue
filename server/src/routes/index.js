import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM products WHERE status = 'active' ORDER BY id DESC LIMIT 50`
    );

    return res.json({ products: result.rows });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao listar produtos.',
      detail: error.message,
    });
  }
});

router.post('/', async (req, res) => {
  const {
    name,
    barcode,
    internalCode,
    unit,
    weightKg,
    costPerKg,
    salePricePerKg,
    minimumStock,
    stock,
    companyId = 1,
  } = req.body || {};

  if (!name || !internalCode || !costPerKg || !salePricePerKg) {
    return res.status(400).json({
      message: 'Informe nome, código interno, custo por kg e preço de venda.',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (
        company_id, name, barcode, internal_code, unit, weight_kg,
        cost_per_kg, sale_price_per_kg, minimum_stock, stock_quantity, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active', NOW())
      RETURNING *`,
      [
        companyId,
        name,
        barcode || '',
        internalCode,
        unit || 'kg',
        Number(weightKg || 1),
        Number(costPerKg),
        Number(salePricePerKg),
        Number(minimumStock || 0),
        Number(stock || 0),
      ]
    );

    return res.status(201).json({ product: result.rows[0] });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao criar produto.',
      detail: error.message,
    });
  }
});

router.get('/movements', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM stock_movements ORDER BY created_at DESC LIMIT 20`
    );

    return res.json({ movements: result.rows });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao carregar histórico de movimentações.',
      detail: error.message,
    });
  }
});

export default router;
