const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { subject_id, type } = req.query;
    let query = `SELECT m.*, s.subject_name FROM learning_material m LEFT JOIN subject s ON m.subject_id = s.subject_id WHERE 1=1`;
    const params = [];
    if (subject_id) { query += ' AND m.subject_id = ?'; params.push(subject_id); }
    if (type) { query += ' AND m.type = ?'; params.push(type); }
    query += ' ORDER BY m.upload_date DESC';
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.post('/', async (req, res) => {
  try {
    const { title, type, upload_date, subject_id } = req.body;
    if (!title || !type || !subject_id) return res.status(400).json({ message: 'Title, type and subject required' });
    const [result] = await db.execute(
      'INSERT INTO learning_material (title, type, upload_date, subject_id) VALUES (?, ?, ?, ?)',
      [title, type, upload_date || new Date().toISOString().split('T')[0], parseInt(subject_id)]
    );
    res.status(201).json({ message: 'Material added successfully', materialId: result.insertId });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT material_id FROM learning_material WHERE material_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Material not found' });
    const { title, type, upload_date, subject_id } = req.body;
    const fields = [], values = [];
    if (title) { fields.push('title = ?'); values.push(title); }
    if (type) { fields.push('type = ?'); values.push(type); }
    if (upload_date) { fields.push('upload_date = ?'); values.push(upload_date); }
    if (subject_id) { fields.push('subject_id = ?'); values.push(parseInt(subject_id)); }
    if (!fields.length) return res.status(400).json({ message: 'No fields to update' });
    values.push(req.params.id);
    await db.execute(`UPDATE learning_material SET ${fields.join(', ')} WHERE material_id = ?`, values);
    res.json({ message: 'Material updated successfully' });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT material_id FROM learning_material WHERE material_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Material not found' });
    await db.execute('DELETE FROM resource_link WHERE material_id = ?', [req.params.id]);
    await db.execute('DELETE FROM learning_material WHERE material_id = ?', [req.params.id]);
    res.json({ message: 'Material deleted successfully' });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
