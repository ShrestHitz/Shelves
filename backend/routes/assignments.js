const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { subject_id, status } = req.query;
    let query = `SELECT a.*, s.subject_name FROM assignment a LEFT JOIN subject s ON a.subject_id = s.subject_id WHERE 1=1`;
    const params = [];
    if (subject_id) { query += ' AND a.subject_id = ?'; params.push(subject_id); }
    if (status) { query += ' AND a.status = ?'; params.push(status); }
    query += ' ORDER BY a.due_date ASC';
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT a.*, s.subject_name FROM assignment a LEFT JOIN subject s ON a.subject_id = s.subject_id WHERE a.assignment_id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Assignment not found' });
    res.json(rows[0]);
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, due_date, status, subject_id } = req.body;
    if (!title || !due_date || !subject_id) return res.status(400).json({ message: 'Title, due date and subject are required' });
    const [subjects] = await db.execute('SELECT subject_id FROM subject WHERE subject_id = ?', [subject_id]);
    if (!subjects.length) return res.status(404).json({ message: 'Subject not found' });
    const [result] = await db.execute(
      'INSERT INTO assignment (title, description, due_date, status, subject_id) VALUES (?, ?, ?, ?, ?)',
      [title, description || null, due_date, status || 'Pending', parseInt(subject_id)]
    );
    res.status(201).json({ message: 'Assignment added successfully', assignmentId: result.insertId });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT assignment_id FROM assignment WHERE assignment_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Assignment not found' });
    const { title, description, due_date, status, subject_id } = req.body;
    const fields = [], values = [];
    if (title) { fields.push('title = ?'); values.push(title); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description || null); }
    if (due_date) { fields.push('due_date = ?'); values.push(due_date); }
    if (status) { fields.push('status = ?'); values.push(status); }
    if (subject_id) { fields.push('subject_id = ?'); values.push(parseInt(subject_id)); }
    if (!fields.length) return res.status(400).json({ message: 'No fields to update' });
    values.push(req.params.id);
    await db.execute(`UPDATE assignment SET ${fields.join(', ')} WHERE assignment_id = ?`, values);
    res.json({ message: 'Assignment updated successfully' });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT assignment_id FROM assignment WHERE assignment_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Assignment not found' });
    await db.execute('DELETE FROM assignment WHERE assignment_id = ?', [req.params.id]);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
