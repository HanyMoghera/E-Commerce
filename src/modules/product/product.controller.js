import { Router } from "express";
import {
  getProducts,
  getProduct,
  getByCategory,
  getBySubcategory,
} from "./product.service.js";

const router = Router();

router.get("/", getProducts);

router.get("/:id", getProduct);

router.get("/category/:categoryId", getByCategory);

router.get("/subcategory/:subcategoryId", getBySubcategory);

export default router;
