import { Router } from "express";
import { checkoutOrder, getMyOrders, getOrderById } from "./order.service.js";

import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.use(auth);

router.post("/checkout", checkoutOrder);

router.get("/", getMyOrders);

router.get("/:id", getOrderById);

export default router;
