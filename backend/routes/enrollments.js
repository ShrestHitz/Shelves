const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT e.*, s.name as student_name, sub.subject_name FROM enrollment e
       LEFT JOIN student s ON e.student_id = s.student_id
       LEFT JOIN subject sub ON e.subject_id = sub.subject_id
       ORDER BY s.name`
    );
    res.json(rows);
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.post('/', async (req, res) => {
  try {
    const { student_id, subject_id } = req.body;
    if (!student_id || !subject_id) return res.status(400).json({ message: 'Student and subject required' });
    const [existing] = await db.execute('SELECT * FROM enrollment WHERE student_id = ? AND subject_id = ?', [student_id, subject_id]);
    if (existing.length) return res.status(400).json({ message: 'Already enrolled' });
    await db.execute('INSERT INTO enrollment (student_id, subject_id) VALUES (?, ?)', [parseInt(student_id), parseInt(subject_id)]);
    res.status(201).json({ message: 'Enrollment added successfully' });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.delete('/', async (req, res) => {
  try {
    const { student_id, subject_id } = req.body;
    await db.execute('DELETE FROM enrollment WHERE student_id = ? AND subject_id = ?', [student_id, subject_id]);
    res.json({ message: 'Enrollment removed successfully' });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
