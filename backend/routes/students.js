const express = require('express');
const db = require('../config/database');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { branch, year, search } = req.query;
    let query = 'SELECT student_id, name, email, branch, year FROM student WHERE 1=1';
    const params = [];
    if (branch) { query += ' AND branch = ?'; params.push(branch); }
    if (year) { query += ' AND year = ?'; params.push(year); }
    if (search) { query += ' AND (name LIKE ? OR email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    query += ' ORDER BY student_id DESC';
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT student_id, name, email, branch, year FROM student WHERE student_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Student not found' });
    res.json(rows[0]);
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, password, branch, year } = req.body;
    if (!name || !email || !password || !branch || !year) return res.status(400).json({ message: 'All fields required' });
    const [existing] = await db.execute('SELECT student_id FROM student WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ message: 'Email already exists' });
    const [result] = await db.execute(
      'INSERT INTO student (name, email, password, branch, year) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, branch, parseInt(year)]
    );
    res.status(201).json({ message: 'Student added successfully', studentId: result.insertId });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT student_id FROM student WHERE student_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Student not found' });
    const { name, email, branch, year, password } = req.body;
    const fields = [], values = [];
    if (name) { fields.push('name = ?'); values.push(name); }
    if (email) { fields.push('email = ?'); values.push(email); }
    if (branch) { fields.push('branch = ?'); values.push(branch); }
    if (year) { fields.push('year = ?'); values.push(parseInt(year)); }
    if (password) { fields.push('password = ?'); values.push(password); }
    if (!fields.length) return res.status(400).json({ message: 'No fields to update' });
    values.push(req.params.id);
    await db.execute(`UPDATE student SET ${fields.join(', ')} WHERE student_id = ?`, values);
    res.json({ message: 'Student updated successfully' });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT student_id FROM student WHERE student_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Student not found' });
    await db.execute('DELETE FROM enrollment WHERE student_id = ?', [req.params.id]);
    await db.execute('DELETE FROM community_post WHERE student_id = ?', [req.params.id]);
    await db.execute('DELETE FROM student WHERE student_id = ?', [req.params.id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
