const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../helpers/apiError");
const service = require("./service");
const { createValidation } = require("./validator");
exports.add = expressAsyncHandler(async (req, res, next) => {
  const {    serviceProvider,createdBy, name,description,banner } = req.body;
  const validate = createValidation.validate(req.body);
  if (validate.error) {
    return next(new ApiError(validate.error, 400));
  }
  const result = await service.create(serviceProvider,createdBy,name, description, banner);
  if (result) {
    return res.status(201).send({
      msg: "Added",
      data: result,
    });
  } else {
    return res.status(400).send({ msg: "Failed!" });
  }
});
exports.update = expressAsyncHandler(async (req, res, next) => {
  const {serviceProvider,updatedBy,acpId, name, description, banner } = req.body;
  const result = await service.update(serviceProvider,updatedBy,acpId,name, description, banner);
  if (result) {
    return res.status(200).send({
      msg: "Updated",
      data: result,
    });
  } else {
    return res.status(400).send({ msg: "Failed!" });
  }
});
exports.get = expressAsyncHandler(async (req, res) => {
  try {
    const {serviceProvider}=req.query;
    const result = await service.getAll(serviceProvider);
    res.status(200).send({ msg: "ACP Programs", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});
exports.getOne = expressAsyncHandler(async (req, res) => {
  try {
    const { programId } = req.query;
    const result = await service.getOne(programId);
    if (result) {
      res.status(200).send({ msg: "ACP Program", data: result });
    } else {
      res.status(404).send({ msg: "Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});
