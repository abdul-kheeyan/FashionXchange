const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose.
 * Exits process on connection failure.
 */
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('WARNING: MONGO_URI not set - skipping MongoDB connection (development only).');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`SUCCESS: MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`ERROR: MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
