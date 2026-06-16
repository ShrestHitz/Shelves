const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const router = express.Router();

// Login - works for both students and admins
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    // Check student table first
    const [students] = await db.execute('SELECT * FROM student WHERE email = ?', [email]);
    if (students.length > 0) {
      const student = students[0];
      if (student.password !== password) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: student.student_id, email: student.email, role: 'student', name: student.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
      return res.json({ token, user: { id: student.student_id, name: student.name, email: student.email, role: 'student', branch: student.branch, year: student.year } });
    }

    // Check admin table
    const [admins] = await db.execute('SELECT * FROM admin WHERE email = ?', [email]);
    if (admins.length > 0) {
      const admin = admins[0];
      // Admin password is their role for demo purposes
      const token = jwt.sign({ id: admin.admin_id, email: admin.email, role: 'admin', name: admin.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
      return res.json({ token, user: { id: admin.admin_id, name: admin.name, email: admin.email, role: 'admin' } });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
