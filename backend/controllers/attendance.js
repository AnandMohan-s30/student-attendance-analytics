const pool = require('../db/pool');

const getAll = async (req, res) => {
  try {
    const { date, subject_id, student_id } = req.query;
    let sql = `
      SELECT a.id, a.student_id, a.subject_id, a.status,
             DATE_FORMAT(a.attendance_date, '%Y-%m-%d') AS attendance_date,
             s.name AS student_name, s.roll_no,
             sub.subject_name, sub.subject_code
      FROM attendance a
      JOIN students s ON s.id = a.student_id
      JOIN subjects sub ON sub.id = a.subject_id
      WHERE 1=1
    `;
    const params = [];
    if (date) { sql += ' AND a.attendance_date = ?'; params.push(date); }
    if (subject_id) { sql += ' AND a.subject_id = ?'; params.push(subject_id); }
    if (student_id) { sql += ' AND a.student_id = ?'; params.push(student_id); }
    sql += ' ORDER BY a.attendance_date DESC, s.roll_no';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  const records = req.body; // array of { student_id, subject_id, attendance_date, status }
  if (!Array.isArray(records) || !records.length) return res.status(400).json({ error: 'Array of records required' });
  try {
    const values = records.map(r => [r.student_id, r.subject_id, r.attendance_date, r.status]);
    const [result] = await pool.query(
      'INSERT INTO attendance (student_id, subject_id, attendance_date, status) VALUES ? ON DUPLICATE KEY UPDATE status = VALUES(status)',
      [values]
    );
    res.status(201).json({ message: 'Attendance saved', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'status is required' });
  try {
    const [result] = await pool.query('UPDATE attendance SET status=? WHERE id=?', [status, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM attendance WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, create, update, remove };
