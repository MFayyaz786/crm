const model = require("./model");
const mongoose = require("mongoose");
const projection = require("../config/mongoProjection");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwtServices = require("../utils/jwtServices");
const authIdServices = require("../auth/authIdServices");
const enrollmentId = require("../utils/enrollmentId");
const userStatus = require("../utils/userStatus");
const logService=require("../log/service")
const axios=require("axios")

const service = {
  addUserZip: async (serviceProvider, carrier, zip, enrollment, csr) => {
    const data = new model({
      serviceProvider,
      carrier,
      csr,
      zip,
      enrollmentId: enrollment,
    });
    const result = await data.save();
    return result;
  },
  get: async (serviceProvider) => {
    const result = await model.find(
      { serviceProvider: { $eq: serviceProvider } },
      projection.projection
    );
    return result;
  },
  isUser: async (email) => {
    const result = await model.findOne({ email }, projection.projection);
    return result;
  },
  getByUserID: async (_id) => {
    const result = await model.findById({ _id });
    return result;
  },
  validatePassword: async (password, realPassword) => {
    const valid = await bcrypt.compare(password, realPassword);
    return valid;
  },
  login: async (email) => {
    const result = await model.findOne({ email: email });
    if (result) {
      const uuid = uuidv4();
      console.log("uuid", uuid);
      const refreshToken = jwtServices.create({ uuid, type: "user" });
      const accessToken = jwtServices.create(
        { userId: result._id, type: "user" },
        "5m"
      );
      authIdServices.add(result._id, uuid);
      await model.findOneAndUpdate(
        { _id: result._id },
        { token: accessToken },
        { new: true }
      );
      (result.token = accessToken), (result.refreshToken = refreshToken);
    }
    return result;
  },
  addInitialInformation: async (
    csr,
    _id,
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
  ) => {
    // const salt = await bcrypt.genSalt(10);
    // password = await bcrypt.hash(password, salt);
    const result = await model.findOneAndUpdate(
      { _id },
      {
        csr,
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
        step: 2,
      },
      { new: true }
    );

    return result;
  },
  homeAddress: async (
    csr,
    _id,
    address1,
    address2,
    zip,
    city,
    state,
    isTemporaryAddress
  ) => {
    const result = await model.findOneAndUpdate(
      { _id },
      { csr, address1, address2, zip, city, state, isTemporaryAddress ,step:3},
      { new: true }
    );
    return result;
  },
  question: async (
    csr,
    _id,
    livesWithAnotherAdult,
    hasAffordableConnectivity,
    isSharesIncomeAndExpense
  ) => {
    const result = await model.findOneAndUpdate(
      { _id },
      {
        csr,
        livesWithAnotherAdult,
        hasAffordableConnectivity,
        isSharesIncomeAndExpense,
        step:4
      },
      { new: true }
    );
    return result;
  },
  q2: async (_id, hasAffordableConnectivity) => {
    const result = await model.findOneAndUpdate(
      { _id },
      { hasAffordableConnectivity },
      { new: true }
    );
    return result;
  },
  q3: async (_id, isSharesIncomeAndExpense) => {
    const result = await model.findOneAndUpdate(
      { _id },
      { isSharesIncomeAndExpense },
      { new: true }
    );
    return result;
  },
  acpProgram: async (csr, _id, acpProgram) => {
    const result = await model.findOneAndUpdate(
      { _id },
      {
        csr: new mongoose.Types.ObjectId(csr),
        acpProgram: new mongoose.Types.ObjectId(acpProgram),
        step:5
      },
      { new: true }
    );
    console.log(result);
    return result;
  },
  updateStatus: async (serviceProvider, _id, status) => {
    const result = await model.findOneAndUpdate(
      { _id: _id, serviceProvider: serviceProvider },
      { status: status },
      { new: true }
    );
    return result;
  },
  verifyUserInfoByNVS: async () => {
    const body = {
      firstName: "JOHN",
      middleName: "APPLESAUCE",
      lastName: "SMITH",
      address: "12345 MADE UP LANE",
      state: "MD",
      city: "LOS CANADA",
      zipCode: "00234",
      urbanizationCode: "URB ROYAL OAKS",
      dob: "1970-11-23",
      ssn4: "",
      tribalId: "",
      bqpFirstName: "JOHN",
      bqpLastName: "DOE",
      bqpDob: "1990-09-09",
      bqpSsn4: "",
      bqpTribalId: "",
      alternateId: "1",
      bqpAlternateId: "1",
      eligibilityProgramCode: "E4",
      publicHousingCode: "1",
      consentInd: "Y",
      contactPhoneNumber: "9999999999",
      contactEmail: "JOHNSMITH@EMAIL.COM",
      contactAddress: "123 MADE UP LANE",
      contactCity: "NEW YORK",
      contactState: "NY",
      contactZipCode: "10038",
      contactUrbCode: "URB ROYAL OAKS",
      repId: "",
      repNotAssisted: "1",
      carrierUrl: "companysite.com",
    };
    let log;
    try {
      log = await logService.new("/api/web/acpProgram", body);
    } catch (err) {
      console.log(err);
    }
    Access_token = process.env.NVSTOKEN;
    url = `${process.env.NVSURL}/subscriber`;
    const options = {
      headers: { Access_token },
    };
    const data = await axios.post(url, JSON.stringify(body), options);
    //console.log("data",data.data);
    try {
      logService.updateResponse(log._id, data.data);
    } catch (err) {
      //console.log(err);
    }
    return data.data;
  },
  verifyUser: async (result, program) => {
    const body = {
      applicationId: "",
      transactionType: "enroll",
      transactionEffectiveDate: "12/12/2021",
      sac: "123456",
      lastName: "DOE",
      firstName: "JOHN",
      middleName: "Wayne",
      phoneNumber: "5555555555",
      phoneNumberInEbbp: "",
      last4ssn: "1234",
      tribalId: "1234abcd",
      dob: "04/21/1966",
      serviceType: "DSL",
      primaryAddress1: "175 E 196TH ST",
      primaryAddress2: "APT 1138",
      primaryCity: "NEW YORK",
      primaryState: "NY",
      primaryZipCode: "10001",
      primaryUrbanizationCode: "",
      mailingAddress1: "175 E 196TH ST",
      mailingAddress2: "APT 1138",
      mailingCity: "NEW YORK",
      mailingState: "NY",
      mailingZipCode: "10001",
      mailingUrbanizationCode: "",
      serviceInitializationDate: "01/23/2012",
      bqpLastName: "DOE",
      bqpFirstName: "Jane",
      bqpMiddleName: "Wanda",
      bqpDob: "08/22/1988",
      bqpLast4ssn: "2234",
      bqpTribalId: "",
      ebbpTribalBenefitFlag: "0",
      etcGeneralUse: "A-123456",
      includeSubscriberId: "0",
      repId: "900USACID",
      repNotAssisted: "0",
      deviceReimbursementDate: "11/11/2021",
      consumerFee: "1",
      modelNumber: "Model 2001",
      deviceCopay: "49.99",
      deviceDeliveryMethod: "shipped",
      avpPgrmException: "1",
      schoolLunchException: "1",
      schoolLunchCert: "1",
      schoolName: "Name of school",
      consumerEmail: "consumer@123.com",
      contactPhoneNumber: "3013135441",
      amsFailureException: "1",
      latitude: "34.12345",
      longitude: "-90.12345",
      dupAddressException: "1",
      eligibilityCode: "E50",
      expectedRate: "9.25",
      acpCertInd: "1",
    };
    let log;
    try {
      log = await logService.new("/api/web//acpProgram", body);
    } catch (err) {
      console.log(err);
    }
    Access_token = process.env.NLADTOKEN;
    url = `${process.env.NLADURL}/subscriber`;
    const options = {
      headers: { Access_token },
    };
    const data = await axios.post(url, JSON.stringify(body), options);
    //console.log("data",data.data);
    try {
      logService.updateResponse(log._id, data.data);
    } catch (err) {
      //console.log(err);
    }
    return data.data;
  },
  termsAncConditions: async (csr, _id) => {
    const result = await model.findOneAndUpdate(
      { _id },
      { csr, isAgreeToTerms: true,step:6 },
      { new: true }
    );
    return result;
  },
  plan: async (csr, _id, plan) => {
    const result = await model.findOneAndUpdate(
      { _id },
      { csr, plan: new mongoose.Types.ObjectId(plan),step:7},
      { new: true }
    );
    return result;
  },
  handOver: async (csr, _id) => {
    const result = await model.findOneAndUpdate(
      { _id },
      { csr, isEnrollmentComplete: true,step:8},
      { new: true }
    );
    return result;
  },
  completeEnrollmentUserList: async (serviceProvider) => {
    const result = await model.find({
      serviceProvider: serviceProvider,
      isEnrollmentComplete: { $in: true },
    });
    return result;
  },
  completeEnrollmentUser: async (_id) => {
    const result = await model.findOne({_id:_id,isEnrollmentComplete:true});
    return result;
  },
  rejectedEnrollmentUserList: async (serviceProvider) => {
    const result = await model.find({
      serviceProvider: serviceProvider,
      isApproved: { $in: false },
    });
    return result;
  },
  inCompleteEnrollmentUserList: async (serviceProvider) => {
    const result = await model.find({
      serviceProvider: serviceProvider,
      isEnrollmentComplete: { $in: false },
    });
    return result;
  },
  checkBeneficiaryAddress: async (city, zip, address1, state) => {
    const beneficiary = await model.findOne({ city, zip, address1, state });
    return beneficiary;
  },
  proofEnrollmentUserList: async (serviceProvider) => {
    const result = await model.find({
      serviceProvider: serviceProvider,
      isProofed: true,
      isEnrollmentComplete: true,
    });
    return result;
  },
  withoutProofEnrollmentUserList: async (serviceProvider) => {
    const result = await model.find({
      serviceProvider: serviceProvider,
      isProofed: false,
      isEnrollmentComplete: true,
    });
    return result;
  },
  // updateStatus: async (_id) => {
  //   const result = await model.findOneAndUpdate(
  //     { _id },
  //     { status: userStatus.ACTIVE },
  //     { new: true }
  //   );
  //   return result;
  // },
  updateOtp: async (email, otp) => {
    var otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 3);
    const customer = await model.findOneAndUpdate(
      { email: email },
      { otp, otpExpire: otpExpiry },
      { new: true }
    );
    return customer;
  },
  verifyOTP: async (email, otp) => {
    const verify = await model.findOneAndUpdate(
      { email: email, otp: otp },
      { otp: null }
    );
    return verify;
  },
  otpExpiryValidation: async (email) => {
    const validate = await model.findOne({
      email: email,
      otpExpire: { $gte: new Date() },
    });
    return validate;
  },
  setNewPassword: async (_id, password) => {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const result = await model.findOneAndUpdate(
      { _id: _id },
      {
        password,
      },
      {
        new: true,
      }
    );
    return result;
  },
  forgotPassword: async (email, password) => {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const result = await model.findOneAndUpdate(
      { email },
      { password },
      { new: true }
    );
    return result;
  },
  update: async (
    _id,
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
  ) => {
    const result = await model.findOneAndUpdate(
      { _id },
      {
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
      },
      { new: true }
    );
    return result;
  },
  delete: async (_id) => {
    const result = await model.deleteOne({ _id },{deleted:true});
    return result;
  },
};

module.exports = service;
