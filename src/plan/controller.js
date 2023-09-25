const expressAsyncHandler = require("express-async-handler");
const service = require("./service");
const { createValidation, updateValidation } = require("./validator");
const ApiError = require("../helpers/apiError");

exports.getAll = expressAsyncHandler(async (req, res) => {
  try {
    const {serviceProvider}=req.query;
    const result = await service.get(serviceProvider);
    res.status(200).send({ msg: "Plans", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
});
exports.getSPPlane = expressAsyncHandler(async (req, res) => {
  try {
    const { serviceProvider } = req.query;
    const result = await service.getSPPlan(serviceProvider);
    res.status(200).send({ msg: "Plans", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
});
exports.updateStatus = expressAsyncHandler(async (req, res) => {
  const { id,serviceProvider, updatedBy, status } = req.body;
  const result = await service.updateStatus(id,serviceProvider, updatedBy, status);
  if (result) {
    return res.status(200).send({ msg: "Success", data: result });
  } else {
    return res.status(400).send({ msg: "Failed!" });
  }
});
exports.getOne = expressAsyncHandler(async (req, res) => {
  try {
    const { planId } = req.query;
    const result = await service.getOne(planId);
    if (result) {
      res.status(200).send({ msg: "Plans", data: result });
    } else {
      res.status(404).send({ msg: "Not Found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
});
exports.createPlan = expressAsyncHandler(async (req, res, next) => {
  const {
    createdBy,
    serviceProvider,
    name,
    description,
    type,
    dataAllowance,
    dataAllowanceUnit,
    voiceAllowance,
    voiceAllowanceUnit,
    textAllowance,
    textAllowanceUnit,
    duration,
    durationUnit,
    price,
    additionalFeatures,
    termsAndConditions,
    restrictions,
  } = req.body;
  const validate = createValidation.validate(req.body);
  if (validate.error) {
    return next(new ApiError(validate.error, 400));
  }
  const result = await service.create(
    createdBy,
    serviceProvider,
    name,
    description,
    type,
    dataAllowance,
    dataAllowanceUnit,
    voiceAllowance,
    voiceAllowanceUnit,
    textAllowance,
    textAllowanceUnit,
    duration,
    durationUnit,
    price,
    additionalFeatures,
    termsAndConditions,
    restrictions
  );
  if (result) {
    return res
      .status(201)
      .send({ msg: "Plan Created successfully", data: result });
  } else {
    return res.status(400).send({ msg: "Failed!" });
  }
});
exports.addPlanInBulk = expressAsyncHandler(async (req, res, next) => {
  const result = await service.bulkInsert(req.body);
  if (result) {
    return res
      .status(201)
      .send({ msg: "Plan Created successfully", data: result });
  } else {
    return res.status(400).send({ msg: "Failed!" });
  }
});
exports.updatePlan = expressAsyncHandler(async (req, res, next) => {
  const {
   updatedBy,
    serviceProvider,
    planId,
    name,
    description,
    type,
    dataAllowance,
    dataAllowanceUnit,
    voiceAllowance,
    voiceAllowanceUnit,
    textAllowance,
    textAllowanceUnit,
    duration,
    durationUnit,
    price,
    additionalFeatures,
    termsAndConditions,
    restrictions,
  } = req.body;
  const validate = updateValidation.validate(req.body);
  if (validate.error) {
    return next(new ApiError(validate.error, 400));
  }
  const result = await service.updatePlan(
    updatedBy,
    serviceProvider,
    planId,
    name,
    description,
    type,
    dataAllowance,
    dataAllowanceUnit,
    voiceAllowance,
    voiceAllowanceUnit,
    textAllowance,
    textAllowanceUnit,
    duration,
    durationUnit,
    price,
    additionalFeatures,
    termsAndConditions,
    restrictions,
  );
  if (result) {
    return res
      .status(200)
      .send({ msg: "Plan  updated", data: result });
  } else {
    return res.status(400).send({ msg: "Failed!" });
  }
});
