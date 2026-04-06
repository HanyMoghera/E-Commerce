import { Router } from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "./cart.service.js";

import { validate } from "../../utils/validation.js";
import {
  addToCartSchema,
  updateCartSchema,
  productParamSchema,
} from "./cart.validation.js";

import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/", auth, validate(addToCartSchema), addToCart);

router.get("/", auth, getCart);

router.put(
  "/:productId",
  auth,
  validate(productParamSchema, "params"),
  validate(updateCartSchema),
  updateCartItem,
);

router.delete(
  "/:productId",
  auth,
  validate(productParamSchema, "params"),
  removeFromCart,
);

router.delete("/", auth, clearCart);

export default router;
