import Joi from "joi";
import mongoose from "mongoose";

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const checkoutSchema = Joi.object({
  paymentMethod: Joi.string().valid("cod", "card").required(),
  shippingAddress: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    phone: Joi.string().required(),
  }).required(),
});

export const orderParamSchema = Joi.object({
  id: Joi.string().custom(objectId).required(),
});

export const updateOrderStatusSchema = Joi.object({
  orderStatus: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .required(),
});
