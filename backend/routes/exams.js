const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { subject_id } = req.query;
    let query = `SELECT e.*, s.subject_name FROM exam e LEFT JOIN subject s ON e.subject_id = s.subject_id WHERE 1=1`;
    const params = [];
    if (subject_id) { query += ' AND e.subject_id = ?'; params.push(subject_id); }
    query += ' ORDER BY e.exam_date ASC';
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.post('/', async (req, res) => {
  try {
    const { exam_name, exam_date, max_marks, subject_id } = req.body;
    if (!exam_name || !exam_date || !subject_id) return res.status(400).json({ message: 'Exam name, date and subject required' });
    const [result] = await db.execute(
      'INSERT INTO exam (exam_name, exam_date, max_marks, subject_id) VALUES (?, ?, ?, ?)',
      [exam_name, exam_date, parseInt(max_marks) || 100, parseInt(subject_id)]
    );
    res.status(201).json({ message: 'Exam added successfully', examId: result.insertId });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT exam_id FROM exam WHERE exam_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Exam not found' });
    const { exam_name, exam_date, max_marks, subject_id } = req.body;
    const fields = [], values = [];
    if (exam_name) { fields.push('exam_name = ?'); values.push(exam_name); }
    if (exam_date) { fields.push('exam_date = ?'); values.push(exam_date); }
    if (max_marks) { fields.push('max_marks = ?'); values.push(parseInt(max_marks)); }
    if (subject_id) { fields.push('subject_id = ?'); values.push(parseInt(subject_id)); }
    if (!fields.length) return res.status(400).json({ message: 'No fields to update' });
    values.push(req.params.id);
    await db.execute(`UPDATE exam SET ${fields.join(', ')} WHERE exam_id = ?`, values);
    res.json({ message: 'Exam updated successfully' });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT exam_id FROM exam WHERE exam_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Exam not found' });
    await db.execute('DELETE FROM exam WHERE exam_id = ?', [req.params.id]);
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
