// src/modules/payment/payment.routes.js
import express from "express";
import { stripeWebhook } from "./payment.controller.js";

const router = express.Router();

// Stripe webhook route (raw body required)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

export default router;
