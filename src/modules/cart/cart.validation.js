import Joi from "joi";
import mongoose from "mongoose";

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

//ADD TO CART (body)
export const addToCartSchema = Joi.object({
  productId: Joi.string().custom(objectId).required(),
  quantity: Joi.number().min(1).required(),
});

// UPDATE CART (body فقط)
export const updateCartSchema = Joi.object({
  quantity: Joi.number().min(1).required(),
});

// PARAMS (productId في URL)
export const productParamSchema = Joi.object({
  productId: Joi.string().custom(objectId).required(),
});
