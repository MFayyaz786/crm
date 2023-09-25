const model = require("./model");
const mongoose = require("mongoose");
const projection = require("../config/mongoProjection");
const bcrypt = require("bcrypt");
const jwtService = require("../utils/jwtServices");
const { v4: uuidv4 } = require("uuid");
const authIdServices = require("../auth/authIdServices");
const adminUserService=require("../adminUser/adminUserServices")
const roleModel=require("../rolePermission/roleModel")
const service = {
  get: async () => {
    const result = await model.find(
      { active: true },
      { _id: 1, url: 1, name: 1, email: 1, contact: 1, alias: 1, type: 1 }
    );
    // .populate({
    //   path: "superAdminUser",
    //   select: { name: 1, email: 1, contact: 1 },
    // });
    return result;
  },
  inActive: async () => {
    const result = await model.find(
      { active: false },
      { _id: 1, url: 1, name: 1, email: 1, contact: 1, alias: 1, type: 1 }
    );
    // .populate({
    //   path: "superAdminUser",
    //   select: { name: 1, email: 1, contact: 1 },
    // });
    return result;
  },
  updateStatus: async (_id, updatedBy, status) => {
    const result = await model.findOneAndUpdate(
      { _id },
      { updatedBy, active: status }
    );
    return result;
  },
  getByUserID: async (_id) => {
    var _id = new mongoose.Types.ObjectId(_id);
    const result = await model.findById(
      { _id },
      { _id: 1, name: 1, email: 1, contact: 1, cnic: 1 }
    );
    // .populate({
    //   path: "superAdminUser",
    //   select: { name: 1, email: 1, contact: 1 },
    // });
    return result;
  },
  addNew: async (
    name,
    alias,
    type,
    url,
    email,
    password,
    phone,
    zipCode,
    country,
    state,
    subDomain,
    EIN,
    createdBy,
    address
  ) => {
    const user = new model({
      name,
      alias,
      type,
      url,
      email,
      phone,
      zipCode,
      country,
      state,
      subDomain,
      EIN,
      createdBy: new mongoose.Types.ObjectId(createdBy),
      address,
    });
    const result = await user.save();
    if(result){
      const role = await roleModel.findOne({
        role: "Super_Admin",
        isSuperPanelRole:false,
      });
      await adminUserService.addNew(result._id,email,password,role)
    }
    return result;
  },
  update: async (
    _id,
    name,
    alias,
    type,
    url,
    email,
    phone,
    zipCode,
    country,
    state,
    subDomain,
    EIN,
    updatedBy,
    address
  ) => {
    const result = await model.findOneAndUpdate(
      { _id },
      {
        name,
        alias,
        type,
        url,
        email,
        phone,
        zipCode,
        country,
        state,
        subDomain,
        EIN,
        updatedBy,
        updatedBy: new mongoose.Types.ObjectId(updatedBy),
        address,
      },
      { new: true }
    );
    return result;
  },
  delete: async (_id) => {
    var _id = new mongoose.Types.ObjectId(_id);
    const result = await model.deleteOne({ _id });
    return result;
  },
  validatePassword: async (password, realPassword) => {
    console.log(password, realPassword);
    const valid = await bcrypt.compare(password, realPassword);
    return valid;
  },
  isActive: async (email) => {
    const result = await model.findOne(
      { email: email, active: true },
      { createdAt: 0, updatedAt: 0, __v: 0 }
    );
    return result;
  },
  login: async (email) => {
    const result = await model.findOne(
      { email: email },
      { createdAt: 0, updatedAt: 0, __v: 0 }
    );
    if (result) {
      //   const role_permission = await rolePermissionServices.getRolePermission(
      //     result.role
      //   );
      //   if (role_permission) {
      //     result.modules = role_permission.modules;
      //   } else {
      //     result.modules = [];
      //   }
      const uuid = uuidv4();
      console.log("uuid", uuid);
      const refreshToken = jwtService.create({ uuid, type: "serviceProvider" });
      const accessToken = jwtService.create(
        { userId: result._id, type: "serviceProvider" },
        "5m"
      );
      authIdServices.add(result._id, uuid);
      await model.findOneAndUpdate(
        { _id: result._id },
        { token: accessToken },
        { new: true }
      );
      // (result.accessToken = accessToken),
      result.refreshToken = refreshToken;
    }
    return result;
  },
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
    console.log(email, password);
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const result = await model.findOneAndUpdate(
      { email },
      { password },
      { new: true }
    );
    return result;
  },
};

module.exports = service;
