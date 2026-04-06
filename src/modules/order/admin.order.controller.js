import { Router } from "express";
import { getAllOrders, updateOrderStatus } from "./order.service.js";

import { auth, allowRoles } from "../../middleware/auth.middleware.js";

const router = Router();

router.use(auth, allowRoles("admin"));
router.get("/", getAllOrders);
router.patch("/:id/status", updateOrderStatus);

export default router;
