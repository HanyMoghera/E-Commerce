import { Router } from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getSubcategoriesByCategory,
} from "./category.service.js";

import { validate } from "../../utils/validation.js";
import { upload } from "../../middleware/multer.middleware.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";

import {
  auth,
  allowRoles,
  authOptional,
} from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  auth,
  allowRoles("admin"),
  upload.single("image"),
  validate(createCategorySchema),
  createCategory,
);

router.put(
  "/:id",
  auth,
  allowRoles("admin"),
  upload.single("image"),
  validate(updateCategorySchema),
  updateCategory,
);

router.delete("/:id", auth, allowRoles("admin"), deleteCategory);
router.get("/:id/subcategories", getSubcategoriesByCategory);
router.get("/", authOptional, getCategories);

export default router;
