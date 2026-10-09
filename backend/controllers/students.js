const pool = require('../db/pool');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*,
        ROUND(
          IFNULL(SUM(a.status = 'Present') / COUNT(a.id) * 100, 0), 2
        ) AS attendance_percentage
      FROM students s
      LEFT JOIN attendance a ON a.student_id = s.id
      GROUP BY s.id
      ORDER BY s.name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Student not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  const { roll_no, name, email, branch, semester, section } = req.body;
  if (!roll_no || !name) return res.status(400).json({ error: 'roll_no and name are required' });
  try {
    const [result] = await pool.query(
      'INSERT INTO students (roll_no, name, email, branch, semester, section) VALUES (?, ?, ?, ?, ?, ?)',
      [roll_no, name, email || null, branch || null, semester || null, section || null]
    );
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Roll number already exists' });
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  const { roll_no, name, email, branch, semester, section } = req.body;
  if (!roll_no || !name) return res.status(400).json({ error: 'roll_no and name are required' });
  try {
    const [result] = await pool.query(
      'UPDATE students SET roll_no=?, name=?, email=?, branch=?, semester=?, section=? WHERE id=?',
      [roll_no, name, email || null, branch || null, semester || null, section || null, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Student not found' });
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Roll number already exists' });
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
