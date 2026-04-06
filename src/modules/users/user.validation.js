import Joi from "joi";

// Update profile schema
export const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .messages({
      "string.pattern.base": "Phone must be between 10-15 digits",
    }),
  avatar: Joi.string().optional(),
});
