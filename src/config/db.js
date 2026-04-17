const mongoose = require('mongoose');

async function connectDB(uri) {
  const target = uri || process.env.MONGO_URI;
  if (!target) throw new Error('MONGO_URI is not set');
  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(target);
  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}

module.exports = connectDB;
