import { Router } from "express";
import {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getSubcategoryById,
} from "./subcategory.service.js";

import { validate } from "../../utils/validation.js";
import {
  createSubcategorySchema,
  updateSubcategorySchema,
} from "./subcategory.validation.js";

import { auth, allowRoles } from "../../middleware/auth.middleware.js";

import { upload } from "../../middleware/multer.middleware.js";

const router = Router();

router.post(
  "/",
  auth,
  allowRoles("admin"),
  upload.single("image"),
  validate(createSubcategorySchema),
  createSubcategory,
);

router.put(
  "/:id",
  auth,
  allowRoles("admin"),
  upload.single("image"),
  allowRoles("admin"),
  validate(updateSubcategorySchema),
  updateSubcategory,
);

router.delete("/:id", auth, allowRoles("admin"), deleteSubcategory);

router.get("/:id", getSubcategoryById);

export default router;
