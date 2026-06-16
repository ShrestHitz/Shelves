const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./config/database');

app.use('/api/auth',        require('./routes/auth'));
app.use('/api/students',    require('./routes/students'));
app.use('/api/subjects',    require('./routes/subjects'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/materials',   require('./routes/materials'));
app.use('/api/exams',       require('./routes/exams'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/community',   require('./routes/community'));
app.use('/api/enrollments', require('./routes/enrollments'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Shelves API running' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
