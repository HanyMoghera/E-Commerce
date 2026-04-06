import { Router } from "express";
import { checkIn, checkOut } from "./attendence.service.js";
import { auth, allowRoles } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/checkin", auth, allowRoles("staff"), checkIn);

router.post("/checkout", auth, allowRoles("staff"), checkOut);

export default router;
