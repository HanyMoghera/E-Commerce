import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../../database/models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.util.js";

import { sendVerificationEmail } from "../../common/email/sendEmail.js";
import { redisClient } from "../../database/redis.connection.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, role } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Sorry, this email is already in use!",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password do not match!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "user",
      verificationToken,
      isVerified: false,
    });

    try {
      const url = `http://127.0.0.1:3001/api/v1/auth/verify-email/${verificationToken}`;
      await sendVerificationEmail(email, url);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      return res.status(500).json({
        message:
          "User created but failed to send verification email. Please contact support.",
      });
    }

    res.status(201).json({
      message: "User created successfully! Please verify your email.",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email or password is missing" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email first" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Verification token is missing" });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    if (!user.isVerified) {
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
    }

    const accessToken = generateAccessToken(user);

    res.status(200).json({
      message: "Email verified successfully!",
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const newToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = newToken;
    await user.save();

    const url = `http://127.0.0.1:3001/api/v1/auth/verify-email/${verificationToken}`;
    await sendVerificationEmail(email, url);

    res.status(200).json({
      message: "Verification email resent successfully!",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message:
          "If a user with that email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600 * 1000; // expires in 1 hour

    user.resetPasswordToken = resetToken;
    // save it in redis
    await redisClient.set("resetToken", resetToken);

    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();
    const url = `http://127.0.0.1:3001/api/v1/auth/reset-password/${resetToken}`;
    await sendVerificationEmail(email, url, "Password Reset Request");

    res.status(200).json({
      message: "If a user with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: error.message });
  }
};
