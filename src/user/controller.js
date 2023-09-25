const express = require("express");
const service = require("./service");
const passwordValidator = require("../utils/passwordValidator");
const { v4: uuidv4 } = require("uuid");
const enrollmentId = require("../utils/enrollmentId");
const acpService=require("../acpPrograms/service")
const serviceAreaServices = require("../serviceArea/service");
const carrierServices=require("../carrier/service");
const PWGServices=require("../pwg/service")
const {
  verifyZip,
  initialInformation,
  homeAddressValidation,
  question,
  selectProgram,
  selectPlan,
  handOver,
  termsAndConditions,
} = require("./validator");
const AppError = require("../helpers/apiError");
const expressAsyncHandler = require("express-async-handler");

exports.getAll = expressAsyncHandler(async (req, res) => {
  const {serviceProvider}=req.query;
  const result = await service.get(serviceProvider);
  res.status(200).send({ msg: "users", data: result });
});
exports.getOne = expressAsyncHandler(async (req, res) => {
  let { userId } = req.query;
  const result = await service.getByUserID(userId);
  if (result) {
    return res.status(200).send({ msg: "user", data: result });
  } else {
    return res.status(400).send({ msg: "User Not Found" });
  }
});

exports.verifyZip = expressAsyncHandler(async (req, res,next) => {
  let {serviceProvider,carrier, csr, zipCode, } = req.body;
  const validate = verifyZip.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }
  let enrollment = enrollmentId();
  // const isService = await serviceAreaServices.isServiceZipCode(
  //   carrier,
  //   zipCode,
  // );
  //const selectedCarrier=await carrierServices.getByUserID(carrier);
  //  const isService = await PWGServices.coverageInformation(
  //    selectedCarrier.name,
  //    zipCode
  //  );
  //const isService = await PWGServices.coverageInformation();
  //  console.log(isService);
  // if (isService.statusCode!=='00') {
  //    const errorMessage = isService.errors.error.message;
  //   return res.status(400).send({
  //     msg: errorMessage,
  //     // "We're sorry, but your zip code is not currently in our service area",
  //   });
  // }
  const result = await service.addUserZip(serviceProvider,carrier,zipCode, enrollment, csr);
  if (result) {
    return res.status(200).send({
      msg: "Congratulation  you zip code exist in our service area",
      data: result,
    });
  } else {
    return res.status(400).send({ msg: "Not verify zip code!" });
  }
});
exports.initialInformation = expressAsyncHandler(async (req, res, next) => {
  let {
    csr,
    userId,
    firstName,
    middleName,
    lastName,
    suffix,
    SSN,
    DOB,
    bestWayToReach,
    drivingLicense,
    email,
    contact,
    isReadyToGetServices,
    isSelfReceive,
    isACP,
  } = req.body;
  const validate = initialInformation.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }
  const result = await service.addInitialInformation(
    csr,
    userId,
    firstName,
    middleName,
    lastName,
    suffix,
    SSN,
    DOB,
    bestWayToReach,
    drivingLicense,
    email,
    contact,
    isReadyToGetServices,
    isSelfReceive,
    isACP
  );
  if (result) {
    return res.status(201).send({
      msg: "Congratulations! Your basic information has been saved. Thank you for enrolling with us",
      data: result,
    });
  } else {
    return res.status(400).send({ msg: "Failed to save basic information!" });
  }
});
exports.homeAddress = expressAsyncHandler(async (req, res, next) => {
  let {
    csr,
    userId,
    city,
    zip,
    address1,
    address2,
    state,
    isTemporaryAddress,
  } = req.body;
  const validate = homeAddressValidation.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }
  const isBeneficiaryAddress = await service.checkBeneficiaryAddress(
    city,
    zip,
    address1,
    state
  );
  if (isBeneficiaryAddress) {
    return res.status(400).send({
      msg: "This home address already in beneficiary list!",
    });
  }
  const result = await service.homeAddress(
    csr,
    userId,
    address1,
    address2,
    zip,
    city,
    state,
    isTemporaryAddress
  );
  if (result) {
    return res.status(201).send({
      msg: "Home address information has been saved successfully",
      data: result,
    });
  } else {
    return res.status(400).send({ msg: "Failed to save home information!" });
  }
});
exports.question = expressAsyncHandler(async (req, res, next) => {
  let {
    csr,
    userId,
    livesWithAnotherAdult,
    hasAffordableConnectivity,
    isSharesIncomeAndExpense,
  } = req.body;
  const validate = question.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }
  const result = await service.question(
    csr,
    userId,
    livesWithAnotherAdult,
    hasAffordableConnectivity,
    isSharesIncomeAndExpense
  );
  if (result) {
    return res.status(201).send({
      msg: "Noted",
      data: result,
    });
  } else {
    return res.status(400).send({ msg: "Failed !" });
  }
});
// exports.q2 = expressAsyncHandler(async (req, res, next) => {
//   let { userId, hasAffordableConnectivity } = req.body;
//   const validate = q2.validate(req.body);
//   if (validate.error) {
//     return next(new AppError(validate.error, 400));
//   }
//   const result = await service.q2(userId, hasAffordableConnectivity);
//   if (result) {
//     return res.status(201).send({
//       msg: "Noted",
//       data: result,
//     });
//   } else {
//     return res.status(400).send({ msg: "Failed !" });
//   }
// });
// exports.q3 = expressAsyncHandler(async (req, res, next) => {
//   let { userId, isSharesIncomeAndExpense } = req.body;
//   const validate = q3.validate(req.body);
//   if (validate.error) {
//     return next(new AppError(validate.error, 400));
//   }
//   const result = await service.q3(userId, isSharesIncomeAndExpense);
//   if (result) {
//     return res.status(201).send({
//       msg: "Noted",
//       data: result,
//     });
//   } else {
//     return res.status(400).send({ msg: "Failed !" });
//   }
// });
exports.acpProgram = expressAsyncHandler(async (req, res, next) => {
  let { csr, userId, program } = req.body;
  const validate = selectProgram.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }
  const acpProgram=await acpService.getOne(program);
  const userInfo=await service.getByUserID(userId)
  if(acpProgram && userInfo){
    //const verify=await service.verifyUser(userInfo,program);
    //const illegible=verify.status==='201'?true:false
    const updateInfo = await service.acpProgram(csr, userId, program);
     if(
      //verify.status==='201'
      updateInfo){
    return res.status(201).send({
      msg: "Success",
      data: updateInfo,
    });
  }else{
     return res.status(400).send({ msg: "Failed!" });
  }
  } else {
    return res.status(400).send({ msg: "Failed !" });
  }
});
exports.termsAndConditions = expressAsyncHandler(async (req, res, next) => {
  let { csr, userId } = req.body;
  const validate = termsAndConditions.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }
  const result = await service.termsAncConditions(csr, userId);
  if (result) {
    return res.status(201).send({
      msg: "Added",
      data: result,
    });
  } else {
    return res.status(400).send({ msg: "Failed !" });
  }
});
exports.selectPlan = expressAsyncHandler(async (req, res, next) => {
  let { csr, userId, plan } = req.body;
  const validate = selectPlan.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }
  const result = await service.plan(csr, userId, plan);
  if (result) {
    return res.status(201).send({
      msg: "Added",
      data: result,
    });
  } else {
    return res.status(400).send({ msg: "Failed !" });
  }
});
exports.handOver = expressAsyncHandler(async (req, res, next) => {
  let { csr, userId } = req.body;
  const validate = handOver.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }
  const result = await service.handOver(csr, userId);
  if (result) {
    return res.status(201).send({
      msg: "Success",
      data: result,
    });
  } else {
    return res.status(400).send({ msg: "Failed !" });
  }
});
exports.updateStatus = expressAsyncHandler(async (req, res) => {
  const {serviceProvider, id, status } = req.body;
  console.log(req.body);
  const result = await service.updateStatus(serviceProvider, id, status);
  if (result) {
    return res.status(200).send({ msg: "Success", data: result });
  } else {
    return res.status(400).send({ msg: "Failed!" });
  }
});
exports.completeEnrollmentUserList = expressAsyncHandler(async (req, res) => {
  const result = await service.completeEnrollmentUserList(
    req.query.serviceProvider
  );
  res.status(200).send({
    msg: "Users",
    data: result,
  });
});
exports.rejectedEnrollmentUserList = expressAsyncHandler(async (req, res) => {
  const result = await service.rejectedEnrollmentUserList(
    req.query.serviceProvider
  );
  res.status(200).send({
    msg: "Users",
    data: result,
  });
});
exports.inCompleteEnrollmentUserList = expressAsyncHandler(async (req, res) => {
  const result = await service.inCompleteEnrollmentUserList(
    req.query.serviceProvider
  );
  res.status(200).send({
    msg: "Users",
    data: result,
  });
});
exports.proofedEnrollmentUserList = expressAsyncHandler(async (req, res) => {
  const result = await service.proofEnrollmentUserList(
    req.query.serviceProvider
  );
  res.status(200).send({
    msg: "Users",
    data: result,
  });
});
exports.withoutProofedEnrollmentUserList = expressAsyncHandler(
  async (req, res) => {
    const result = await service.withoutProofEnrollmentUserList(
      req.query.serviceProvider
    );
    res.status(200).send({
      msg: "Users",
      data: result,
    });
  }
);

exports.login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ msg: "Fields Missing" });
  }
  const user = await service.login(email);
  if (user) {
    const validatePassword = await service.validatePassword(
      password,
      user.password
    );
    if (validatePassword) {
      res.status(200).send({
        msg: "Login Successfully",
        data: user,
      });
    } else {
      res.status(401).send({
        msg: "Invalid Credentials!",
      });
    }
  } else {
    res.status(401).send({
      msg: "Invalid Credentials!",
    });
  }
});
exports.sendOtp = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  // const otp = OTP();
  let otp = 1111;
  const result = await service.updateOtp(email, otp);
  if (result) {
    // const sendMail = await sendEmail(email, otp);
    // if (!sendMail) {
    //   res.status(400).json({ msg: "OTP not sent" });
    // }
    res.status(200).json({ msg: "OTP sent" });
  } else {
    res.status(400).json({ msg: "OTP not sent" });
  }
});
exports.verifyOtp = expressAsyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const verifyExpireOtp = await service.otpExpiryValidation(email);
  console.log("expire", verifyExpireOtp);
  if (!verifyExpireOtp) {
    res.status(400).send({
      msg: "Otp Expire please try again!",
    });
  } else {
    const verifyOtp = await service.verifyOTP(email, otp);
    if (verifyOtp) {
      res.status(200).send({ msg: "OTP Verified" });
    } else {
      res.status(400).send({ msg: "Invalid OTP" });
    }
  }
});
exports.resetPassword = expressAsyncHandler(async (req, res) => {
  const { userId, password, reEnterPassword } = req.body;
  console.log(password, reEnterPassword);
  if (password !== reEnterPassword) {
    return res.status(400).send({ msg: "Passwords Don't Match" });
  }
  if (!passwordValidator.schema.validate(password)) {
    return res.status(400).send({
      msg: "Password must have at least:1 uppercase letter,1 lowercase letter,1 number and 1 special character",

      //validator.schema.validate(password, { list: true }),
    });
  }
  const result = await service.setNewPassword(userId, password);
  if (result) {
    res.status(200).json({ msg: "Password reset!", data: result });
  } else {
    res.status(400).json({ msg: "password failed to reset" });
  }
});
exports.forgotPassword = expressAsyncHandler(async (req, res) => {
  const { email, password, reEnterPassword } = req.body;
  if (!email || !password || !reEnterPassword) {
    return res.status(400).send({ msg: "Fields Missing" });
  }
  if (password !== reEnterPassword) {
    res.status(400).send({
      msg: "Password And reEnterPassword don't Match",
    });
  }
  if (!passwordValidator.schema.validate(password)) {
    return res.status(400).send({
      msg: "Password must have at least:1 uppercase letter,1 lowercase letter,1 number and 1 special character",

      //validator.schema.validate(password, { list: true }),
    });
  }
  const result = await service.forgotPassword(email, password);
  if (result) {
    return res
      .status(200)
      .send({ msg: "Password has been changed successfully" });
  } else {
    return res.status(400).send({ msg: "Password not Updated" });
  }
});
exports.update = expressAsyncHandler(async (req, res) => {
  let {
    userId,
    firstName,
    middleName,
    lastName,
    SSN,
    suffix,
    contact,
    city,
    address1,
    address2,
    zip,
    state,
    isTemporaryAddress,
    drivingLicense,
    DOB,
    bestWayToReach,
    isSelfReceive,
    isACP,
  } = req.body;
  const result = await service.update(
    userId,
    firstName,
    middleName,
    lastName,
    SSN,
    suffix,
    contact,
    city,
    address1,
    address2,
    zip,
    state,
    isTemporaryAddress,
    drivingLicense,
    DOB,
    bestWayToReach,
    isSelfReceive,
    isACP
  );
  if (result) {
    return res.status(200).send({ msg: "User profile reset", data: result });
  } else {
    return res.status(400).send({ msg: "Failed to reset" });
  }
});
exports.delete = expressAsyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).send({ msg: "Fields Missing" });
  }
  const result = await service.delete(userId);
  if (result.deletedCount == 0) {
    return res.status(400).send({ msg: "ID Not found" });
  }
  if (result) {
    return res.status(200).send({ msg: "User deleted.", data: result });
  } else {
    return res.status(400).send({ msg: "User not deleted" });
  }
});
