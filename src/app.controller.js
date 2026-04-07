import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { databaseConnection } from "./database/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/users/user.controller.js";
import categoryRouter from "./modules/category/category.controller.js";
import subcategoryRouter from "./modules/subCategory/subcategory.controller.js";
import productRouter from "./modules/product/product.controller.js";
import adminProductRouter from "./modules/product/admin.product.controller.js";
import orderRouter from "./modules/order/order.controller.js";
import adminOrderRouter from "./modules/order/admin.order.controller.js";
import staffRouter from "./modules/staff/staff.controller.js";
import attendencRouter from "./modules/attendence/attendence.controller.js";
import cartRouter from "./modules/cart/cart.controller.js";
import { connectRedis } from "./database/redis.connection.js";
import paymentRouter from "./modules/payment/payment.routes.js";

import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import helmet from "helmet";

export async function bootstrap() {
  const app = express();
  app.use(cors());
  app.use(helmet());

  app.use(express.json());
  databaseConnection();
  await connectRedis();
  app.use(express.urlencoded({ extended: true }));
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  app.use("/api/v1/payments", paymentRouter); // Stripe webhook route
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subcategoryRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/admin/products", adminProductRouter);
  app.use("/api/v1/orders", orderRouter);
  app.use("/api/v1/admin/orders", adminOrderRouter);
  app.use("/api/v1/admin/staff", staffRouter);
  app.use("/api/v1/staff/", attendencRouter);
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
