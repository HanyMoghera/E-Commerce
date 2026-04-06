import Joi from "joi";
import mongoose from "mongoose";

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const createStaffSchema = Joi.object({
  user: Joi.custom(objectId).required(),
  dailySalary: Joi.number().required(),
  joinDate: Joi.date(),
  department: Joi.string().max(100),
});

export const updateStaffSchema = Joi.object({
  dailySalary: Joi.number(),
  joinDate: Joi.date(),
  department: Joi.string().max(100),
  isActive: Joi.boolean(),
});
