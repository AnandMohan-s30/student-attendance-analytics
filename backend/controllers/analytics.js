const pool = require('../db/pool');

const overview = async (req, res) => {
  try {
    const [[{ total_students }]] = await pool.query('SELECT COUNT(*) AS total_students FROM students');
    const [[{ total_subjects }]] = await pool.query('SELECT COUNT(*) AS total_subjects FROM subjects');
    const [[{ avg_attendance }]] = await pool.query(`
      SELECT ROUND(AVG(pct), 2) AS avg_attendance FROM (
        SELECT ROUND(SUM(status='Present')/COUNT(*)*100, 2) AS pct
        FROM attendance GROUP BY student_id
      ) t
    `);
    const [[{ below_75 }]] = await pool.query(`
      SELECT COUNT(*) AS below_75 FROM (
        SELECT student_id, ROUND(SUM(status='Present')/COUNT(*)*100, 2) AS pct
        FROM attendance GROUP BY student_id HAVING pct < 75
      ) t
    `);
    res.json({ total_students, total_subjects, avg_attendance: avg_attendance || 0, below_75 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const studentAnalytics = async (req, res) => {
  try {
    const id = req.params.id;
    const [[student]] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const [subjectWise] = await pool.query(`
      SELECT sub.id AS subject_id, sub.subject_code, sub.subject_name,
             COUNT(a.id) AS total_classes,
             SUM(a.status='Present') AS present,
             SUM(a.status='Absent') AS absent,
             ROUND(SUM(a.status='Present')/COUNT(a.id)*100, 2) AS percentage
      FROM subjects sub
      JOIN attendance a ON a.subject_id = sub.id AND a.student_id = ?
      GROUP BY sub.id
    `, [id]);

    const [[overall]] = await pool.query(`
      SELECT COUNT(*) AS total, SUM(status='Present') AS present,
             SUM(status='Absent') AS absent,
             ROUND(SUM(status='Present')/COUNT(*)*100, 2) AS percentage
      FROM attendance WHERE student_id = ?
    `, [id]);

    const [monthly] = await pool.query(`
      SELECT DATE_FORMAT(attendance_date, '%Y-%m') AS month,
             COUNT(*) AS total, SUM(status='Present') AS present,
             ROUND(SUM(status='Present')/COUNT(*)*100, 2) AS percentage
      FROM attendance WHERE student_id = ?
      GROUP BY DATE_FORMAT(attendance_date, '%Y-%m') ORDER BY month
    `, [id]);

    const [history] = await pool.query(`
      SELECT a.id, DATE_FORMAT(a.attendance_date, '%Y-%m-%d') AS attendance_date,
             a.status, sub.subject_code, sub.subject_name
      FROM attendance a
      JOIN subjects sub ON sub.id = a.subject_id
      WHERE a.student_id = ?
      ORDER BY a.attendance_date DESC LIMIT 100
    `, [id]);

    res.json({ student, overall, subjectWise, monthly, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const subjectAnalytics = async (req, res) => {
  try {
    const id = req.params.id;
    const [[subject]] = await pool.query('SELECT * FROM subjects WHERE id = ?', [id]);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    const [studentWise] = await pool.query(`
      SELECT s.id, s.roll_no, s.name, s.branch, s.section,
             COUNT(a.id) AS total, SUM(a.status='Present') AS present,
             ROUND(SUM(a.status='Present')/COUNT(a.id)*100, 2) AS percentage
      FROM students s
      JOIN attendance a ON a.student_id = s.id AND a.subject_id = ?
      GROUP BY s.id ORDER BY percentage DESC
    `, [id]);

    const [[overall]] = await pool.query(`
      SELECT COUNT(*) AS total, SUM(status='Present') AS present,
             ROUND(SUM(status='Present')/COUNT(*)*100, 2) AS percentage
      FROM attendance WHERE subject_id = ?
    `, [id]);

    res.json({ subject, overall, studentWise });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const monthly = async (req, res) => {
  try {
    const [rows] = await pool.query(`
        SELECT DATE_FORMAT(attendance_date, '%Y-%m') AS month,
               COUNT(*) AS total, SUM(status='Present') AS present,
               ROUND(SUM(status='Present')/COUNT(*)*100, 2) AS percentage
        FROM attendance
        GROUP BY DATE_FORMAT(attendance_date, '%Y-%m') ORDER BY month
      `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const defaulters = async (req, res) => {
  try {
    const { semester, section, subject_id } = req.query;
    let sql = `
      SELECT s.id, s.roll_no, s.name, s.branch, s.semester, s.section, s.email,
             COUNT(a.id) AS total_classes,
             SUM(a.status='Present') AS present,
             ROUND(SUM(a.status='Present')/COUNT(a.id)*100, 2) AS percentage
      FROM students s
      JOIN attendance a ON a.student_id = s.id
      WHERE 1=1
    `;
    const params = [];
    if (subject_id) { sql += ' AND a.subject_id = ?'; params.push(subject_id); }
    if (semester) { sql += ' AND s.semester = ?'; params.push(semester); }
    if (section) { sql += ' AND s.section = ?'; params.push(section); }
    sql += ' GROUP BY s.id HAVING percentage < 75 ORDER BY percentage ASC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const subjectOverview = async (req, res) => {
  try {
    const [rows] = await pool.query(`
        SELECT sub.id, sub.subject_code, sub.subject_name,
               COUNT(a.id) AS total_records,
               ROUND(IFNULL(SUM(a.status='Present')/NULLIF(COUNT(a.id),0)*100, 0), 2) AS avg_percentage
        FROM subjects sub
        LEFT JOIN attendance a ON a.subject_id = sub.id
        GROUP BY sub.id ORDER BY avg_percentage DESC
      `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const distribution = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        SUM(pct >= 90) AS above_90,
        SUM(pct >= 75 AND pct < 90) AS between_75_90,
        SUM(pct >= 60 AND pct < 75) AS between_60_75,
        SUM(pct < 60) AS below_60
      FROM (
        SELECT ROUND(SUM(status='Present')/COUNT(*)*100, 2) AS pct
        FROM attendance GROUP BY student_id
      ) t
    `);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const topBottom = async (req, res) => {
  try {
    const [all] = await pool.query(`
      SELECT s.id, s.roll_no, s.name, s.branch,
             ROUND(SUM(a.status='Present')/COUNT(a.id)*100, 2) AS percentage
      FROM students s
      JOIN attendance a ON a.student_id = s.id
      GROUP BY s.id ORDER BY percentage DESC
    `);
    const top5 = all.slice(0, 5);
    const bottom5 = [...all].sort((a, b) => a.percentage - b.percentage).slice(0, 5);
    res.json({ top5, bottom5 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { overview, studentAnalytics, subjectAnalytics, monthly, defaulters, subjectOverview, distribution, topBottom };
