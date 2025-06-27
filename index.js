import express from "express";
import dotenv from "dotenv";
import dbConnection from "./db/db.js";
import userRoutes from "./routes/user-route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import mediaRoutes from "./routes/midea-routes.js";
import categoriesRoutes from "./routes/categories-route.js";
import userFollowRouter from "./routes/follower-routes.js";

dotenv.config();
const app = express();

dbConnection();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://ecover-se.vercel.app",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", userRoutes);
app.use("/api", mediaRoutes);
app.use("/api/categories", categoriesRoutes);
app.use('/user',userFollowRouter)

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
