const expressAsyncHandler = require("express-async-handler");
const service = require("./service");
const { provideSimValidation } = require("./validator");
const ApiError = require("../helpers/apiError");
const userService = require("../user/service");
const deviceServices=require("../deviceInventory/service")
const simServices = require("../simInventory/service");
const userStatus=require("../utils/userStatus");
const billServices = require("../billing/billingServices");


exports.provideSim = expressAsyncHandler(async (req, res, next) => {
  const { serviceProvider, user, esn, mdn, carrier, type, invoiceType } =
    req.body;
  const {error} = provideSimValidation.validate(req.body);
  if (error) {
    return next(new ApiError(error.details[0].message, 400));
  }

  let hasDevice;
  let availabilityMsg;
const isEnrolled=await userService.completeEnrollmentUser(user);
if(!isEnrolled){
  return res.status(400).send({msg:"Please fist complete enrollment!"})
}
  if (mdn) {
    const checkDevice = await deviceServices.checkAvailability(
      serviceProvider,
      carrier,
      mdn
    );
    if (!checkDevice) {
      availabilityMsg = "This device is currently not available!";
    } else {
      hasDevice = true;
    }
  } else {
    const checkSim = await simServices.checkAvailability(
      serviceProvider,
      carrier,
      esn
    );
    if (!checkSim) {
      availabilityMsg = "This SIM is currently not available!";
    } else {
      hasDevice = false;
    }
  }
  if (availabilityMsg) {
    return res.status(200).send({ msg: availabilityMsg });
  }
  // console.log(serviceProvider, user, esn, mdn, carrier, type, hasDevice);
  // return;
  const result = await service.provideSim(
    serviceProvider,
    user,
    esn,
    mdn,
    carrier,
    type,
    hasDevice
  );

  if (result) {
    const updateUser=await userService.updateStatus(serviceProvider,user,userStatus.ACTIVE);
    if(updateUser){
    await billServices.createBill(
      serviceProvider,
      user,
      invoiceType,
      updateUser.plan
    );
    }
    return res.status(201).send({
      msg: "success",
      data: result,
    });
  } else {
    return res.status(400).send({
      msg: "Failed!",
    });
  }
});

// get all devices
exports.getAll = expressAsyncHandler(async (req, res) => {
  const result = await service.getAll(req.query.serviceProvider);
  res.status(200).send({ msg: "list", data: result });
});

// get by serial number
exports.getByESN = expressAsyncHandler(async (req, res) => {
  const { esn } = req.query;
  const result = await service.getByESN(esn);
  if (result) {
    res.status(200).send({ msg: "Details", data: result });
  } else {
    res.status(404).send({ msg: "Not found" });
  }
});
//device inventory
exports.getByMDN = expressAsyncHandler(async (req, res) => {
  const { mdn } = req.query;
  const result = await deviceServices.getByMDN(mdn);
  if (result) {
    res.status(200).send({ msg: "Details", data: result });
  } else {
    res.status(404).send({ msg: "Not Found!" });
  }
});
// update device by id
exports.updateOrderInfo = expressAsyncHandler(async (req, res) => {
  const { userId, esn,mdn, hasDevice } = req.body;
  const result = await service.update(
    userId,
    esn,
    mdn,
    hasDevice
  );
  if (result) {
    res.status(200).send({ msg: "Details updated", data: result });
  } else {
    res.status(400).send({ msg: "Failed!" });
  }
});

exports.userServicesHistory = expressAsyncHandler(async (req, res) => {
  let { userId } = req.query;
  const result = await service.userServicesHistory(userId);
  return res.status(200).send({ msg: "Services history", data: result });
});
