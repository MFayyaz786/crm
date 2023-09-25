const model = require("./model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const projection = require("../config/mongoProjection");
const jwtService = require("../utils/jwtServices");
const { v4: uuidv4 } = require("uuid");
const authIdServices = require("../auth/authIdServices");
const service = {
  isAssignRole: async (role) => {
    const result = await model.findOne({ role: role });
    return result;
  },
  get: async () => {
    const result = await model
      .find({active:true}, { _id: 1, firstName: 1,lastName:1,createdDate:1, email: 1, contact: 1, cnic: 1,active:1 })
      .populate({
        path: "role",
        select: { _id: 1, role: 1 },
      });
    return result;
  },
  inActive: async () => {
    const result = await model
      .find(
        { active: false },
        { _id: 1, firstName: 1,lastName:1,createdDate:1, email: 1, contact: 1, cnic: 1,active:1 }
      )
      .populate({
        path: "role",
        select: { _id: 1, role: 1 },
      });
    return result;
  },
  getByUserID: async (_id) => {
    var _id = new mongoose.Types.ObjectId(_id);
    const result = await model
      .findById(
        { _id },
        {
          _id: 1,
          firstName: 1,
          lastName: 1,
          createdDate: 1,
          email: 1,
          contact: 1,
          cnic: 1,
        }
      )
      .populate({
        path: "role",
        select: { _id: 1, role: 1, permissions: 1 },
      });
    // if (result) {
    //   const role_permission = await rolePermissionServices.getRolePermission(
    //     result.role
    //   );
    //   if (role_permission) {
    //     result.modules = role_permission.modules;
    //   } else {
    //     result.modules = [];
    //   }
    // }
    return result;
  },
  validatePassword: async (password, realPassword) => {
    console.log(password, realPassword);
    const valid = await bcrypt.compare(password, realPassword);
    return valid;
  },
  login: async (email) => {
    const result = await model
      .findOne({ email: email }, { createdAt: 0, updatedAt: 0, __v: 0 })
      .populate({
        path: "role",
        select: { permissions: 1, role: 1, description: 1 },
      });
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
      const refreshToken = jwtService.create({ uuid, type: "superAdmin" });
      const accessToken = jwtService.create(
        { userId: result._id, type: "superAdmin" },
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
  addNew: async (role, firstName,lastName, email, password, contact, cnic, address) => {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = new model({
      role: new mongoose.Types.ObjectId(role),
      firstName,lastName,
      email,
      password,
      contact,
      cnic,
      address,
    });
    const result = await user.save();
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
  update: async (_id, role, firstName,lastName, cnic, contact, address) => {
    const result = await model.findOneAndUpdate(
      { _id },
      {
        firstName,lastName,
        role: new mongoose.Types.ObjectId(role),
        cnic,
        contact,
        address,
      },
      { new: true }
    );
    return result;
  },
  updateStatus: async (_id,status) => {
    const result = await model.findOneAndUpdate(
      { _id },
      {
       active:status
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
};


module.exports = service;
