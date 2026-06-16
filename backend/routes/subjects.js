const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { semester } = req.query;
    let query = 'SELECT * FROM subject WHERE 1=1';
    const params = [];
    if (semester) { query += ' AND semester = ?'; params.push(semester); }
    query += ' ORDER BY subject_id';
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM subject WHERE subject_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Subject not found' });
    res.json(rows[0]);
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.post('/', async (req, res) => {
  try {
    const { subject_name, semester, credits } = req.body;
    if (!subject_name || !semester || !credits) return res.status(400).json({ message: 'All fields required' });
    const [result] = await db.execute(
      'INSERT INTO subject (subject_name, semester, credits) VALUES (?, ?, ?)',
      [subject_name, parseInt(semester), parseInt(credits)]
    );
    res.status(201).json({ message: 'Subject added successfully', subjectId: result.insertId });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT subject_id FROM subject WHERE subject_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Subject not found' });
    const { subject_name, semester, credits } = req.body;
    const fields = [], values = [];
    if (subject_name) { fields.push('subject_name = ?'); values.push(subject_name); }
    if (semester) { fields.push('semester = ?'); values.push(parseInt(semester)); }
    if (credits) { fields.push('credits = ?'); values.push(parseInt(credits)); }
    if (!fields.length) return res.status(400).json({ message: 'No fields to update' });
    values.push(req.params.id);
    await db.execute(`UPDATE subject SET ${fields.join(', ')} WHERE subject_id = ?`, values);
    res.json({ message: 'Subject updated successfully' });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT subject_id FROM subject WHERE subject_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Subject not found' });
    await db.execute('DELETE FROM subject WHERE subject_id = ?', [req.params.id]);
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error(error);
    if (error.message.includes('Cannot delete subject')) return res.status(400).json({ message: 'Cannot delete subject with existing assignments' });
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
