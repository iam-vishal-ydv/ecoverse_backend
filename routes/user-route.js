import express from "express";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
  restPasswordOtp,
  updateProfile,
  verifyOtpController,
} from "../controllers/user-controller.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerController);
userRoutes.post("/login", loginController);
userRoutes.post("/verify-email", verifyOtpController);
userRoutes.post("/forgot-password", forgotPasswordController);
userRoutes.post("/verify-reset-otp", restPasswordOtp);
userRoutes.post("/change-password", resetPasswordController);
userRoutes.post("/logout", logoutController);
router.put("/profile", auth, upload.single("avatar"), updateProfile);

export default userRoutes;
