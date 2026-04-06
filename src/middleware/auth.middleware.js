import jwt from "jsonwebtoken";
import { User } from "../database/models/user.model.js";
import ratelimit from "express-rate-limit";
export const auth = (req, res, next) => {
  let { token } = req.headers;
  const SECRETKRY = process.env.JWT_SECRET;

  if (!token) {
    return res.status(401).json({
      message: "Token is required",
    });
  }

  const verifyToken = jwt.verify(token, SECRETKRY);
  if (!verifyToken) {
    res.status(401).json({
      message: "Invalid Token",
    });
  } else {
    req.user = verifyToken;
    next();
  }
};

export const allowRoles = (...roles) => {
  return async (req, res, next) => {
    let userId = req.user.id;
    const user = await User.findById(userId);
    if (!roles.includes(user.role)) {
      return res.status(403).json({
        message: "Sorry, you are not authorized for this action!",
      });
    }
    next();
  };
};

// auth middleware with optional token (for public routes that can be accessed by both authenticated and unauthenticated users)
export const authOptional = (req, res, next) => {
  const { token } = req.headers;
  if (!token) return next(); // public user
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    next();
  }
};

export const loginLimiter = ratelimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: {
    message: "Too much login attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
