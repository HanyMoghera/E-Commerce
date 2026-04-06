import Joi from "joi";
import mongoose from "mongoose";

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).required(),
  category: Joi.string().custom(objectId).required(),
  subcategory: Joi.string().custom(objectId).required(),
  images: Joi.array().items(Joi.string().uri()),
});

export const updateProductSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(""),
  price: Joi.number().min(0),
  stock: Joi.number().min(0),
  category: Joi.string().custom(objectId),
  subcategory: Joi.string().custom(objectId),
  images: Joi.any().optional(),
});

export const updateStockSchema = Joi.object({
  stock: Joi.number().min(0).required(),
});
