const Joi = require("joi");
module.exports = {
  verifyZip: Joi.object({
    csr: Joi.string().required(),
    zipCode: Joi.string().required(),
    carrier: Joi.string().required(),
    serviceProvider:Joi.string().required()
  }),
  initialInformation: Joi.object({
    csr: Joi.string().required(),
    userId: Joi.string().required(),
    firstName: Joi.string().required(),
    middleName: Joi.string(),
    lastName: Joi.string().required(),
    suffix: Joi.string(),
    SSN: Joi.string().pattern(/^[0-9]{4}$/),
    DOB: Joi.date().iso().max("now"),
    bestWayToReach: Joi.string().required(),
    drivingLicense: Joi.string().required(),
    email: Joi.string()
      .email()
      .required()
      .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
    contact: Joi.string()
      .pattern(/^\+[1-9]\d{1,14}$/)
      .required(),
    isSelfReceive: Joi.boolean(),
    isReadyToGetServices:Joi.boolean(),
    isACP: Joi.boolean().required(),
  }),
  homeAddressValidation: Joi.object({
    csr: Joi.string().required(),
    userId: Joi.string().required(),
    address1: Joi.string().required(),
    address2: Joi.string(),
    city: Joi.string().required(),
    zip: Joi.string().required(),
    state: Joi.string().required(),
    isTemporaryAddress: Joi.boolean().required(),
  }),
  question: Joi.object({
    csr: Joi.string().required(),
    userId: Joi.string().required(),
    livesWithAnotherAdult: Joi.boolean().required(),
    hasAffordableConnectivity: Joi.boolean().required(),
    isSharesIncomeAndExpense: Joi.boolean().required(),
  }),
  // q2: Joi.object({
  //   userId: Joi.string().required(),
  //   hasAffordableConnectivity: Joi.boolean().required(),
  // }),
  // q3: Joi.object({
  //   userId: Joi.string().required(),
  //   isSharesIncomeAndExpense: Joi.boolean().required(),
  // }),
  selectProgram: Joi.object({
    csr: Joi.string().required(),
    userId: Joi.string().required(),
    program: Joi.string().required(),
  }),
  termsAndConditions: Joi.object({
    csr: Joi.string().required(),
    userId: Joi.string().required(),
  }),
  selectPlan: Joi.object({
    csr: Joi.string().required(),
    userId: Joi.string().required(),
    plan: Joi.string().required(),
  }),
  handOver: Joi.object({
    csr: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};
