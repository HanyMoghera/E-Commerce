import { Router } from "express";
import {
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
} from "./product.service.js";

import { validate } from "../../utils/validation.js";
import {
  createProductSchema,
  updateProductSchema,
  updateStockSchema,
} from "./product.validation.js";

import { auth, allowRoles } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";

const router = Router();

router.use(auth, allowRoles("admin"));

router.post(
  "/",
  upload.array("images", 10),
  validate(createProductSchema),
  createProduct,
);

router.put(
  "/:id",
  upload.array("images", 10),
  validate(updateProductSchema),
  updateProduct,
);

router.patch("/:id/stock", validate(updateStockSchema), updateStock);

router.delete("/:id", deleteProduct);

export default router;
