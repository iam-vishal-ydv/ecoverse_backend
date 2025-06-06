import express from "express";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resendOtp,
  resetPasswordController,
  restPasswordOtp,
  updateProfile,
  verifyOtpController,
} from "../controllers/user-controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerController);
userRoutes.post("/login", loginController);
userRoutes.post("/verify-email", verifyOtpController);
userRoutes.post("/forgot-password", forgotPasswordController);
userRoutes.post("/verify-reset-otp", restPasswordOtp);
userRoutes.post("/change-password", resetPasswordController);
userRoutes.post("/logout", logoutController);
userRoutes.post("/check-verify-email", resendOtp);
userRoutes.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  updateProfile
);

export default userRoutes;
