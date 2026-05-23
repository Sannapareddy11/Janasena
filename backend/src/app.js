const express = require('express');
const cors = require('cors');
const path = require('path');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api', newsRoutes); // handles /api/news and /api/admin/news

// Base status route
app.get('/', (req, res) => {
  res.json({ message: 'NewsHub API is running...' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
