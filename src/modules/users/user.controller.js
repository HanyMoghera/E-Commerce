import { Router } from "express";
import {
  getProfile,
  updateProfile,
  deleteProfile,
  uploadAvatar,
} from "./user.service.js";
import { validate } from "../../utils/validation.js";
import { updateProfileSchema } from "./user.validation.js";
import { auth } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";
const router = Router();

router.get("/profile", auth, getProfile);

router.put(
  "/profile",
  auth,
  validate(updateProfileSchema),
  upload.single("avatar"),
  updateProfile,
);

router.delete("/profile", auth, deleteProfile);

router.post("/upload-avatar", auth, upload.single("avatar"), uploadAvatar);

export default router;
