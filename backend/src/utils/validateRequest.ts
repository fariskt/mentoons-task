import Joi from "joi";

export const registerSchema = Joi.object({
  firstname: Joi.string().min(2).required().messages({
    "string.empty": "firstname is required.",
    "string.min": "firstname must be at least 2 characters.",
  }),
  lastname: Joi.string().min(1).messages({
    "string.min": "lastname must be at least 1 characters.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Invalid email format.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters.",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Invalid email format.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters.",
  }),
});


export const validate = (schema: Joi.ObjectSchema, data: any) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return { isValid: false, messages };
  }
  return { isValid: true, messages: [] };
};