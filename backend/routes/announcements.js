const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT a.*, ad.name as admin_name FROM announcement a LEFT JOIN admin ad ON a.admin_id = ad.admin_id ORDER BY a.date DESC`
    );
    res.json(rows);
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.post('/', async (req, res) => {
  try {
    const { title, message, date, admin_id } = req.body;
    if (!title || !message) return res.status(400).json({ message: 'Title and message required' });
    const [result] = await db.execute(
      'INSERT INTO announcement (title, message, date, admin_id) VALUES (?, ?, ?, ?)',
      [title, message, date || new Date().toISOString().split('T')[0], admin_id || 1]
    );
    res.status(201).json({ message: 'Announcement added successfully', announcementId: result.insertId });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT announcement_id FROM announcement WHERE announcement_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Announcement not found' });
    const { title, message, date } = req.body;
    const fields = [], values = [];
    if (title) { fields.push('title = ?'); values.push(title); }
    if (message) { fields.push('message = ?'); values.push(message); }
    if (date) { fields.push('date = ?'); values.push(date); }
    if (!fields.length) return res.status(400).json({ message: 'No fields to update' });
    values.push(req.params.id);
    await db.execute(`UPDATE announcement SET ${fields.join(', ')} WHERE announcement_id = ?`, values);
    res.json({ message: 'Announcement updated successfully' });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT announcement_id FROM announcement WHERE announcement_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Announcement not found' });
    await db.execute('DELETE FROM announcement WHERE announcement_id = ?', [req.params.id]);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
