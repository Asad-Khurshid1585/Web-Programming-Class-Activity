const mongoose = require('mongoose');

/**
 * Connects to MongoDB using Mongoose.
 * Database: studentDB
 */
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/studentDB';
        await mongoose.connect(uri);
        console.log('MongoDB connected to studentDB');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
