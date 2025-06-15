import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function dbConnection() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Please provide MONGODB_URI");
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to DB successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

export default dbConnection;
