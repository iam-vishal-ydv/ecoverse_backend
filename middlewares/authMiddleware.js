import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req?.cookies?.token || req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized access" });
  }
};
