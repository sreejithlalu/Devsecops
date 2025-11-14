// index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const tasks = require('./routes/tasks');
const connectDB = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/healthz', (req, res) => res.status(200).send('Healthy'));

// Readiness check — depends on MongoDB
let lastReadyState = null;
app.get('/ready', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  if (isDbConnected !== lastReadyState) {
    console.log(`Database readyState changed: ${mongoose.connection.readyState}`);
    lastReadyState = isDbConnected;
  }
  return isDbConnected ? res.status(200).send('Ready') : res.status(503).send('Not Ready');
});

// Startup check
app.get('/started', (req, res) => res.status(200).send('Started'));

// API routes
app.use('/api/tasks', tasks);

// Start server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`🚀 Backend running on port ${port}...`);
});

// Connect to MongoDB
connectDB()
  .then(ok => {
    if (!ok) {
      console.warn('⚠️  App started but MongoDB connection failed. /ready will return 503.');
    }
  })
  .catch(err => console.error('Unexpected DB connection error:', err));

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  server.close(async () => {
    await require('./db').closeDB();
    process.exit(0);
  });
});

