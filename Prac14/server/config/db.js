const mongoose = require("mongoose");

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from the environment");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected successfully");
}

module.exports = connectDB;