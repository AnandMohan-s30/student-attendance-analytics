const pool = require('../db/pool');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM subjects ORDER BY subject_code');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM subjects WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Subject not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  const { subject_code, subject_name, semester, faculty_name } = req.body;
  if (!subject_code || !subject_name) return res.status(400).json({ error: 'subject_code and subject_name are required' });
  try {
    const [result] = await pool.query(
      'INSERT INTO subjects (subject_code, subject_name, semester, faculty_name) VALUES (?, ?, ?, ?)',
      [subject_code, subject_name, semester || null, faculty_name || null]
    );
    const [rows] = await pool.query('SELECT * FROM subjects WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Subject code already exists' });
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  const { subject_code, subject_name, semester, faculty_name } = req.body;
  if (!subject_code || !subject_name) return res.status(400).json({ error: 'subject_code and subject_name are required' });
  try {
    const [result] = await pool.query(
      'UPDATE subjects SET subject_code=?, subject_name=?, semester=?, faculty_name=? WHERE id=?',
      [subject_code, subject_name, semester || null, faculty_name || null, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Subject not found' });
    const [rows] = await pool.query('SELECT * FROM subjects WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Subject code already exists' });
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Subject not found' });
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
