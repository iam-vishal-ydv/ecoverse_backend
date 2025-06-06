import express from "express";
import {
  handleEmailVerification,
  handleResetPassword,
  loginController,
  logoutController,
  registerController,
  updateProfile,
} from "../controllers/user-controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerController);
userRoutes.post("/verify-email", handleEmailVerification);
userRoutes.post("/login", loginController);
userRoutes.post("/reset-password", handleResetPassword);
userRoutes.post("/logout", logoutController);
userRoutes.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  updateProfile
);

export default userRoutes;
