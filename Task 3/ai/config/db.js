const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/studentDB";

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
