import { Router } from "express";
import {
  signup,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "./auth.service.js";
import { validate } from "../../utils/validation.js";
import {
  signupSchema,
  loginSchema,
  resetPasswordSchema,
} from "./auth.validation.js";

import { loginLimiter } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  resetPassword,
);

export default router;
