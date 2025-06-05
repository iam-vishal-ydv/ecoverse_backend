import express from "express";
import dotenv from "dotenv";
import dbConnection from "./db/db.js";
import userRoutes from "./routes/user-route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

dbConnection();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://ecover-se.vercel.app"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
