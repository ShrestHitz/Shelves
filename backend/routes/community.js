const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT p.*, s.name as student_name FROM community_post p LEFT JOIN student s ON p.student_id = s.student_id ORDER BY p.post_date DESC`
    );
    res.json(rows);
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.post('/', async (req, res) => {
  try {
    const { content, student_id } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });
    const [result] = await db.execute(
      'INSERT INTO community_post (content, post_date, student_id) VALUES (?, ?, ?)',
      [content, new Date().toISOString().split('T')[0], student_id || null]
    );
    res.status(201).json({ message: 'Post added successfully', postId: result.insertId });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT post_id FROM community_post WHERE post_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Post not found' });
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });
    await db.execute('UPDATE community_post SET content = ? WHERE post_id = ?', [content, req.params.id]);
    res.json({ message: 'Post updated successfully' });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT post_id FROM community_post WHERE post_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Post not found' });
    await db.execute('DELETE FROM community_post WHERE post_id = ?', [req.params.id]);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
