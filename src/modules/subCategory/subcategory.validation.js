import Joi from "joi";

// Create Subcategory
export const createSubcategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 50 characters",
  }),
  categoryId: Joi.string().required().messages({
    "string.empty": "Category ID is required",
  }),
});

// Update Subcategory
export const updateSubcategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 50 characters",
  }),
  categoryId: Joi.string().messages({
    "string.base": "Category ID must be a valid string",
  }),
  isDeleted: Joi.boolean(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });
