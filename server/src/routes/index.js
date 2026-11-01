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

router.get('/products', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM products WHERE status = 'active' ORDER BY id ASC`
    );
    return res.json({ products: result.rows });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao listar produtos.',
      detail: error.message,
    });
  }
});

router.post('/products', async (req, res) => {
  const {
    name,
    barcode = '',
    internalCode,
    unit = 'kg',
    weightKg = 1,
    costPerKg,
    salePricePerKg,
    minimumStock = 0,
    stock = 0,
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
        barcode,
        internalCode,
        unit,
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

router.get('/suppliers', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM suppliers ORDER BY id ASC`);
    return res.json({ suppliers: result.rows });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao listar fornecedores.',
      detail: error.message,
    });
  }
});

router.post('/suppliers', async (req, res) => {
  const { name, phone = '', cnpj = '', category = 'Carnes', address = '' } = req.body || {};

  if (!name) {
    return res.status(400).json({ message: 'Informe o nome do fornecedor.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO suppliers (name, phone, cnpj, category, address, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [name, phone, cnpj, category, address]
    );

    return res.status(201).json({ supplier: result.rows[0] });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao cadastrar fornecedor.',
      detail: error.message,
    });
  }
});

router.get('/purchases', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM purchases ORDER BY purchase_date DESC, id DESC`
    );
    return res.json({ purchases: result.rows });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao listar compras.',
      detail: error.message,
    });
  }
});

router.post('/purchases', async (req, res) => {
  const { supplierId, purchaseDate, paymentType = 'prazo', notes = '', items = [] } = req.body || {};

  if (!supplierId || !items.length) {
    return res.status(400).json({
      message: 'Informe fornecedor e ao menos um item na compra.',
    });
  }

  const total = items.reduce((sum, item) => sum + Number(item.total || 0), 0);

  try {
    const purchaseResult = await pool.query(
      `INSERT INTO purchases (supplier_id, purchase_date, payment_type, total_amount, status, notes, created_at)
       VALUES ($1, $2, $3, $4, 'recebido', $5, NOW())
       RETURNING *`,
      [supplierId, purchaseDate || new Date().toISOString().slice(0, 10), paymentType, total, notes]
    );

    const purchaseId = purchaseResult.rows[0].id;

    for (const item of items) {
      const productId = Number(item.productId);
      const incomingQty = Number(item.weight || item.quantity || 0);
      const unitCost = Number(item.costPerKg || 0);
      const lineTotal = Number(item.total || incomingQty * unitCost);

      await pool.query(
        `INSERT INTO purchase_items (purchase_id, product_id, quantity, weight_kg, unit_cost, total_amount, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [purchaseId, productId, Number(item.quantity || incomingQty), Number(item.weight || incomingQty), unitCost, lineTotal]
      );

      await pool.query(
        `UPDATE products
         SET stock_quantity = stock_quantity + $1,
             cost_per_kg = $2,
             updated_at = NOW()
         WHERE id = $3`,
        [incomingQty, Number((unitCost || 0).toFixed(2)), productId]
      );
    }

    if (paymentType === 'prazo') {
      await pool.query(
        `INSERT INTO payables (supplier_id, purchase_id, amount, status, due_date, created_at)
         VALUES ($1, $2, $3, 'pendente', NOW() + INTERVAL '15 days', NOW())`,
        [supplierId, purchaseId, total]
      );
    }

    return res.status(201).json({ purchase: purchaseResult.rows[0] });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao registrar compra.',
      detail: error.message,
    });
  }
});

router.get('/products/low-stock', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM products WHERE stock_quantity <= minimum_stock ORDER BY stock_quantity ASC`
    );
    return res.json({ items: result.rows });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao listar produtos com estoque mínimo.',
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
