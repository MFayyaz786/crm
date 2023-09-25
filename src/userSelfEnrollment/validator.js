const Joi = require("joi");
module.exports = {
  verifyZip: Joi.object({
    serviceProvider:Joi.string().required(),
    carrier: Joi.string().required(),
    email: Joi.string()
      .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .required()
      .messages({
        "string.pattern.base": "Email must be a valid @gmail.com address",
      }),
    zipCode: Joi.string().required(),
  }),
  initialInformation: Joi.object({
    userId: Joi.string().required(),
    firstName: Joi.string().required(),
    middleName: Joi.string(),
    lastName: Joi.string().required(),
    suffix: Joi.string(),
    SSN: Joi.string().pattern(/^[0-9]{4}$/),
    DOB: Joi.date().iso().max("now"),
    contact: Joi.string()
      .pattern(/^\+[1-9]\d{1,14}$/)
      .required(),
  }),
  homeAddressValidation: Joi.object({
    userId: Joi.string().required(),
    address1: Joi.string().required(),
    address2: Joi.string(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    isTerribleTerritory: Joi.boolean().required(),
    isBillAddress:Joi.boolean().required()
  }),
  selectProgram: Joi.object({
    userId: Joi.string().required(),
    program: Joi.string().required(),
  }),
  termsAndConditions: Joi.object({
    userId: Joi.string().required(),
  }),
  selectPlan: Joi.object({
    userId: Joi.string().required(),
    plan: Joi.string().required(),
  }),
  handOver: Joi.object({
    csr: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};
