import User from "../models/user-model.js";

import generatedToken from "../utils/generatedToken.js";
import { generateOTP } from "../helpers/generateOTP .js";

import verifyTemplate from "../utils/verifyTemplate.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../utils/emailService.js";
import bcrypt from "bcryptjs";

import uploadImageCloudinary from "../utils/uplaodImageCloudinary.js";
import userModel from "../models/user-model.js";


export const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (
      !username ||
      !email ||
      !password ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({ message: "Invalid or missing fields" });
    }
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "Email already registered" });
    }
    if (await User.findOne({ username })) {
      return res.status(409).json({ message: "Username already taken" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOTP(),
      expires = Date.now() + 600_000;
    const user = await new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
      verificationCode: otp,
      verificationCodeExpires: expires,
      isVerified: false,
    }).save();
    await sendVerificationEmail(
      user.email,
      verifyTemplate(username, email, "verify", otp)
    );
    return res.status(201).json({
      message: "Check your email for OTP",
      user: { email: user.email, isVerified: false },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Registration error" });
  }
};
export const handleEmailVerification = async (req, res) => {
  try {
    const { email, otp, resend } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (resend) {
      if (user.isVerified)
        return res.status(400).json({ message: "Email already verified" });

      const newOtp = generateOTP();
      user.verificationCode = newOtp;
      user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      await sendVerificationEmail(user.email, newOtp);
      return res.json({ message: "OTP resent successfully" });
    }

    if (!otp) return res.status(400).json({ message: "OTP is required" });
    if (user.isVerified)
      return res.status(400).json({ message: "Already verified" });
    if (
      user.verificationCode !== otp ||
      user.verificationCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    return res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const handleGetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const newOtp = generateOTP();
    user.verificationCode = newOtp;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(user.email, newOtp);

    return res.json({
      message: "OTP sent successfully to your email.",
      email,
    });
  } catch (error) {
    console.error("Email Verification Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.time("Total Login Time");

    console.time("DB Lookup");
    const user = await User.findOne({ email: email?.toLowerCase() });
    console.timeEnd("DB Lookup");

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified)
      return res.status(401).json({ message: "Please verify email first" });

    console.time("Password Compare");
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.timeEnd("Password Compare");

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.time("Token Generation");
    const token = await generatedToken(user); // custom token logic?
    console.timeEnd("Token Generation");

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    console.timeEnd("Total Login Time");

    return res.json({ message: "Login successful", user, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const handleResetPassword = async (req, res) => {
  try {
    const { email, action, otp, newPassword } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === "sendOtp") {
      const code = generateOTP();
      user.resetPasswordCode = code;
      user.resetPasswordExpires = Date.now() + 600_000;
      await user.save();
      await sendPasswordResetEmail(user.email, verifyTemplate(user.username, email, "reset", code));
      return res.json({ message: "Reset OTP sent" });
    }

    if (action === "verifyOtp") {
      if (
        user.resetPasswordCode !== otp ||
        user.resetPasswordExpires < Date.now()
      ) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      return res.json({ message: "OTP verified" });
    }

    if (action === "updatePassword") {
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordCode = null;
      user.resetPasswordExpires = null;
      await user.save();
      return res.json({ message: "Password reset successfully" });
    }

    return res.status(400).json({ message: "Invalid action" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logoutController = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};

export async function updateProfile(req, res) {
  try {
    const userId = req.user._id;
    const {
      bio,
      location,
      instagram,
      youtube,
      website,
      rank,
      totalViews,
      followers,
      following,
    } = req.body;

    let profileImageUrl = req.user.profileImage;
    const file = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updateData = {};

    // console.log(file, "file");
    if (file) {
      const upload = await uploadImageCloudinary(file);
      // console.log(upload, "upload");
      if (!upload) {
        return res.status(400).json({
          success: false,
          message: "Failed to upload image",
        });
      }
      updateData.profileImage = upload.url;
    }

    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (instagram !== undefined) updateData.instagram = instagram;
    if (youtube !== undefined) updateData.youtube = youtube;
    if (website !== undefined) updateData.website = website;
    if (rank !== undefined) updateData.rank = rank;
    if (totalViews !== undefined) updateData.totalViews = totalViews;
    if (followers !== undefined) updateData.followers = followers;
    if (following !== undefined) updateData.following = following;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No updates provided",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select(
      "-password -resetPasswordCode -resetPasswordExpires -verificationCode -verificationCodeExpires"
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }

    if (error.name === "MongoError" && error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getUserController(req, res) {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select(
      "-password -resetPasswordCode -resetPasswordExpires -verificationCode -verificationCodeExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username)
      return res.status(400).json({ message: "Username is required" });

    const userExists = await User.findOne({
      username: username.trim().toLowerCase(),
    });

    if (userExists) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    return res.status(200).json({ message: "Username is available" });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;


    const user = await userModel.findById(id).select(
      "-password -resetPasswordCode -resetPasswordExpires -verificationCode -verificationCodeExpires"
    );
    ;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
