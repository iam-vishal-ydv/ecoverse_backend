import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("Please provide MONGODB_URI");
}

async function dbConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB successfully");
  } catch (error) {
    console.error("Database connection failed:", error);

    process.exit(1);
  }
}

export default dbConnection;
