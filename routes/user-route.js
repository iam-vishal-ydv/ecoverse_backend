import express from "express";
import {
  checkUsernameAvailability,
  getUserByIdController,
  getUserController,
  handleEmailVerification,
  handleGetEmail,
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
userRoutes.post("/re-verify-email", handleGetEmail);
userRoutes.post("/login", loginController);
userRoutes.post("/reset-password", handleResetPassword);
userRoutes.post("/logout", logoutController);
userRoutes.post("/logout", logoutController);
userRoutes.get("/check-username", checkUsernameAvailability);
userRoutes.put(
  "/profile",
  authMiddleware,
  upload.single("profileImage"),
  updateProfile
);

userRoutes.get("/user/:id",getUserByIdController)
userRoutes.get("/user", authMiddleware, getUserController);

export default userRoutes;
