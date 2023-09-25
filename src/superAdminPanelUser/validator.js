const Joi = require("joi");
module.exports = {
  createNew: Joi.object({
    role: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string()
      .email()
      .required()
      .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
    password: Joi.string()
      .required()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .messages({
        "string.pattern.base":
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character, and be at least 8 characters long",
      }),
    contact: Joi.string()
    .required()
      .pattern(/^\+[1-9]\d{1,14}$/),
    cnic: Joi.string()
    .required()
      .regex(/^\d{5}-\d{7}-\d{1}$/),
    address:Joi.string().required()
  }),
  login: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
  validatePassword: Joi.object({
    userId: Joi.string().required(),
    password: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .required(),
    reEnterPassword: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .required(),
  }),
  verifyOtp:Joi.object({
    email:Joi.string().required(),
    otp:Joi.number().required()
  })
};