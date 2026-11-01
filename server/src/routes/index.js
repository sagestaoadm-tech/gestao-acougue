import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      companyId: user.company_id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET || 'development-secret',
    { expiresIn: '8h' }
  );
}

router.post('/register', async (req, res) => {
  const { companyName, name, email, password } = req.body || {};

  if (!companyName || !name || !email || !password) {
    return res.status(400).json({ message: 'Informe nome da empresa, nome, e-mail e senha.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    const companyExists = await pool.query('SELECT id FROM companies WHERE name = $1', [companyName]);
    if (companyExists.rows.length > 0) {
      return res.status(409).json({ message: 'Já existe uma empresa com este nome.' });
    }

    const hashedPassword = await hashPassword(password);

    const companyResult = await pool.query(
      'INSERT INTO companies (name, status, created_at) VALUES ($1, $2, NOW()) RETURNING id',
      [companyName, 'active']
    );

    const companyId = companyResult.rows[0].id;

    const userResult = await pool.query(
      `INSERT INTO users (company_id, name, email, password_hash, role, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, company_id, name, email, role`,
      [companyId, name, email, hashedPassword, 'admin', 'active']
    );

    const user = userResult.rows[0];

    await pool.query(
      'INSERT INTO audit_logs (company_id, user_id, action, details, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [companyId, user.id, 'register_company', `Empresa ${companyName} criada e usuário ${name} registrado.`,]
    );

    return res.status(201).json({
      message: 'Empresa e administrador criados com sucesso.',
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao registrar empresa.',
      detail: error.message,
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Informe e-mail e senha.' });
  }

  try {
    const result = await pool.query(
      `SELECT id, company_id, name, email, password_hash, role, status
       FROM users
       WHERE email = $1 AND status = 'active'`,
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const user = result.rows[0];
    const validPassword = await comparePassword(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = signToken(user);

    await pool.query(
      'INSERT INTO audit_logs (company_id, user_id, action, details, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [user.company_id, user.id, 'login', `Usuário ${user.email} realizou login.`]
    );

    return res.json({
      message: 'Login realizado com sucesso.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.company_id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao autenticar usuário.',
      detail: error.message,
    });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, company_id, name, email, role FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.json({ user: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao obter dados do usuário.', detail: error.message });
  }
});

export default router;
