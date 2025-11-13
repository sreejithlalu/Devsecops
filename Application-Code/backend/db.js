// db.js
const mongoose = require('mongoose');
require('dotenv').config(); // load .env

// Silence Mongoose strictQuery warning
mongoose.set('strictQuery', false);

const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/deskdemo';

async function connectDB() {
  const uri = process.env.MONGO_URI || DEFAULT_LOCAL_URI;

  if (!uri) {
    console.error('❌ No MongoDB URI found. Set MONGO_URI in .env or environment.');
    return false;
  }

  const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  mongoose.connection.on('connected', () => {
    console.log('✅ Mongoose connected to MongoDB.');
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  Mongoose disconnected.');
  });

  mongoose.connection.on('error', (err) => {
    console.error('🔥 Mongoose connection error:', err?.message || err);
  });

  try {
    await mongoose.connect(uri, connectionOptions);
    console.log('✅ Connected to MongoDB successfully.');
    return true;
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err?.message || err);
    return false;
  }
}

async function closeDB() {
  try {
    await mongoose.connection.close(false);
    console.log('🛑 Mongoose connection closed.');
  } catch (err) {
    console.error('Error closing Mongoose connection:', err);
  }
}

process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

module.exports = connectDB;
module.exports.closeDB = closeDB;

