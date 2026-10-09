const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const pool   = require('../db/pool');

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  // Set secure: true in production (HTTPS).
  // For local development over HTTP keep it false.
  secure: process.env.NODE_ENV === 'production',
  maxAge: 8 * 60 * 60 * 1000, // 8 hours in ms
};

/** POST /api/auth/login */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const [rows] = await pool.query(
    'SELECT id, name, email, password, role FROM users WHERE email = ?',
    [email.trim().toLowerCase()]
  );

  if (rows.length === 0) {
    // Uniform message – do not reveal whether the email exists
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

  res.cookie('token', token, COOKIE_OPTS);
  return res.json({ user: payload });
};

/** POST /api/auth/logout */
exports.logout = (_req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  return res.json({ message: 'Logged out' });
};

/** GET /api/auth/me  – validate cookie and return current user */
exports.me = (req, res) => {
  // req.user is set by authMiddleware (route is protected)
  return res.json({ user: req.user });
};
