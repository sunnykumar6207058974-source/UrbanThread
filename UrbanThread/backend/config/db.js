const mongoose = require('mongoose');

let _memServer = null;

const autoSeedIfEmpty = async () => {
  try {
    const Product = require('../models/Product');
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('🌱 Database is empty — automatically running initial seed...');
      const { seed } = require('../seed/seed');
      await seed(true);
    }
  } catch (err) {
    console.error('⚠️ Auto-seed check notice:', err.message);
  }
};

const connectDB = async () => {
  let uri = process.env.MONGO_URI || 'mongodb://localhost:27017/urbanthread';

  // Try connecting to the configured URI first
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    await autoSeedIfEmpty();
    return;
  } catch {
    // Real MongoDB not available — fall back to in-memory server
  }

  // Start embedded MongoDB (no installation required)
  console.log('⚠️  No MongoDB found at ' + uri);
  console.log('🔄 Starting embedded MongoDB (mongodb-memory-server)...');
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    _memServer = await MongoMemoryServer.create();
    const memUri = _memServer.getUri();
    await mongoose.connect(memUri);
    console.log('✅ Embedded MongoDB started (data is in-memory — resets on restart)');
    console.log('   ➜  For persistent storage, set MONGO_URI in backend/.env');
    await autoSeedIfEmpty();
    return;
  } catch (memErr) {
    console.error('❌ Could not start embedded MongoDB:', memErr.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  if (_memServer) await _memServer.stop();
  process.exit(0);
});

module.exports = connectDB;

