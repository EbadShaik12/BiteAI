const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/biteai');
    console.log(`🚀 Cybernetic Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DB Connection Failure: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
