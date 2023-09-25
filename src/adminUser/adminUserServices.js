const adminUserModel = require("./adminUserModel");
const mongoose = require("mongoose");
const roleRouter = require("../rolePermission/roleRouter");
const { projection } = require("../config/mongoProjection");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwtServices = require("../utils/jwtServices");
const authIdServices = require("../auth/authIdServices");

const adminUserServices = {
  get: async (serviceProvider) => {
    const result = await adminUserModel.aggregate([
      {
        $match: {
          compony: new mongoose.Types.ObjectId(serviceProvider),
        },
      },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "master",
      //     foreignField: "_id",
      //     as: "master",
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$master",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "distributer",
      //     foreignField: "_id",
      //     as: "distributer",
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$distributer",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "retailer",
      //     foreignField: "_id",
      //     as: "retailer",
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$retailer",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "role",
        },
      },
      {
        $unwind: {
          path: "$role",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "usergroups",
          localField: "_id",
          foreignField: "users",
          as: "group",
        },
      },
      {
        $unwind: {
          path: "$group",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          "role._id": 1,
          "role.name": 1,
          name: 1,
          address: 1,
          city: 1,
          zip: 1,
          state: 1,
          createdDate: 1,
          disabledDate: 1,
          email: 1,
          active: 1,
          RADId: 1,
          // "master._id": 1,
          // "master.name": 1,
          // "distributer._id": 1,
          // "distributer.name": 1,
          // "retailer._id": 1,
          // "retailer.name": 1,
          // "group._id": 1,
          // "group.name": 1,
        },
      },
    ]);
    // .populate({
    //   path: "role",
    //   select: { _id: 1, name: 1 },
    // })
    // .populate({
    //   path: "master",
    //   select: { _id: 1, name: 1 },
    // })
    // .populate({
    //   path: "distributer",
    //   select: { _id: 1, name: 1 },
    // })
    // .populate({
    //   path: "retailer",
    //   select: { _id: 1, name: 1 },
    // });
    return result;
  },
  isUser: async (compony, email) => {
    const result = await adminUserModel.findOne(
      { compony, email: email },
      projection.projection
    );
    return result;
  },
  getByUserID: async (_id) => {
    const result = await adminUserModel
      .findOne({ _id }, projection.projection)
      .populate({
        path: "role",
        select: { _id: 1, role: 1 },
      });
    // .populate({
    //   path: "master",
    //   select: { _id: 1, name: 1 },
    // })
    // .populate({
    //   path: "distributer",
    //   select: { _id: 1, name: 1 },
    // })
    // .populate({
    //   path: "retailer",
    //   select: { _id: 1, name: 1 },
    // });

    return result;
  },
  validatePassword: async (password, realPassword) => {
    const valid = await bcrypt.compare(password, realPassword);
    return valid;
  },
  login: async (email) => {
    console.log(email);
    const result = await adminUserModel.aggregate([
      {
        $match: {
          // serviceProvider: { $eq:new mongoose.Types.ObjectId(serviceProvider) },
          email: { $eq: email },
        },
      },
      {
        $lookup: {
          from: "usergroups",
          localField: "_id",
          foreignField: "users",
          as: "usergroup",
        },
      },
      {
        $unwind: {
          path: "$usergroup",
          preserveNullAndEmptyArrays: true,
        },
      },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "master",
      //     foreignField: "_id",
      //     as: "master",
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$master",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "distributer",
      //     foreignField: "_id",
      //     as: "distributer",
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$distributer",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "retailer",
      //     foreignField: "_id",
      //     as: "retailer",
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$retailer",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "role",
        },
      },
      {
        $unwind: {
          path: "$role",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "submodules",
          localField: "role.permissions",
          foreignField: "_id",
          as: "permissions",
        },
      },
      {
        $unwind: {
          path: "$permissions",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$permissions.module",
          permissions: {
            $push: "$permissions",
          },
          user: {
            $first: "$$ROOT",
          },
        },
      },
      {
        $lookup: {
          from: "modules",
          localField: "_id",
          foreignField: "_id",
          as: "_id",
        },
      },
      {
        $unwind: {
          path: "$_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: null,
          user: {
            $first: "$user",
          },
          permissions: {
            $push: {
              module: "$_id",
              subModule: "$permissions",
            },
          },
        },
      },
      {
        $project: {
          _id: "$user._id",
          userName: "$user.name",
          password: "$user.password",
          compony: "$user.compony",
          role: {
            _id: "$user.role._id",
            role: "$user.role.role",
            description: "$user.role.description",
          },
          // master: {
          //   _id: "$user.master._id",
          //   role: "$user.master.name",
          // },
          // distributer: {
          //   _id: "$user.distributer._id",
          //   role: "$user.distributer.name",
          // },
          // retailer: {
          //   _id: "$user.retailer._id",
          //   role: "$user.retailer.name",
          // },
          userGroup: "$user.usergroup.name",
          mobile: "$user.contact",
          email: "$user.email",
          status: "$user.active",
          city: "$user.city",
          address: "$user.address",
          zip: "$user.zip",
          state: "$user.state",
          createdDate: "$user.createdDate",
          disabledDate: "$user.disabledDate",
          permissions: {
            $map: {
              input: "$permissions",
              as: "permission",
              in: {
                module: "$$permission.module.name",
                route: "$$permission.module.route",
                orderPosition: "$$permission.module.orderPosition",
                icon: "$$permission.module.icon",
                subModule: {
                  $map: {
                    input: "$$permission.subModule",
                    as: "sub",
                    in: {
                      name: "$$sub.name",
                      route: "$$sub.route",
                      orderPosition: "$$sub.orderPosition",
                      icon: "$$sub.icon",
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);
    if (result.length !== 0) {
      const uuid = uuidv4();
      console.log("uuid", uuid);
      const refreshToken = jwtServices.create({ uuid, type: "admin" });
      const accessToken = jwtServices.create(
        { userId: result[0]._id, type: "admin" },
        "5m"
      );
      authIdServices.add(result[0]._id, uuid);
      await adminUserModel.findOneAndUpdate(
        { _id: result[0]._id },
        { token: accessToken },
        { new: true }
      );
      (result[0].token = accessToken), (result[0].refreshToken = refreshToken);
    }
    console.log(result);
    return result[0];
  },
  addNew: async (
    compony,
    createdBy,
    roleId,
    name,
    email,
    password,
    RADId,
    contact,
    city,
    address,
    zip,
    state,
    RADId
  ) => {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = new adminUserModel({
      compony: new mongoose.Types.ObjectId(compony),
      createdBy: new mongoose.Types.ObjectId(createdBy),
      role: new mongoose.Types.ObjectId(roleId),
      name,
      email,
      password,
      // agentType,
      // master,
      // distributer,
      // retailer,
      RADId,
      contact,
      city,
      address,
      zip,
      state,
      master,
      distributer,
      retailer,
      RADId,
    });
    const result = await user.save();
    console.log(result);
    return result;
  },
  updateOtp: async (email, otp) => {
    var otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 3);
    const customer = await adminUserModel.findOneAndUpdate(
      { email: email },
      { otp, otpExpire: otpExpiry },
      { new: true }
    );

    return customer;
  },
  verifyOTP: async (email, otp) => {
    const verify = await adminUserModel.findOneAndUpdate(
      { email: email, otp: otp },
      { otp: null }
    );
    return verify;
  },
  otpExpiryValidation: async (email) => {
    const validate = await adminUserModel.findOne({
      email: email,
      otpExpire: { $gte: new Date() },
    });
    return validate;
  },
  setNewPassword: async (_id, password) => {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const result = await adminUserModel.findOneAndUpdate(
      { _id },
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
    const result = await adminUserModel.findOneAndUpdate(
      { email },
      { password },
      { new: true }
    );
    return result;
  },
  update: async (
    compony,
    _id,
    updatedBy,
    roleId,
    name,
    contact,
    city,
    address,
    zip,
    state,
    RADId
  ) => {
    const result = await adminUserModel.findOneAndUpdate(
      { _id },
      {
        compony: new mongoose.Types.ObjectId(compony),
        updatedBy: new mongoose.Types.ObjectId(updatedBy),
        role: new mongoose.Types.ObjectId(roleId),
        name,
        contact,
        // agentType,
        // master,
        // distributer,
        // retailer,
        city,
        address,
        zip,
        state,
        master,
        distributer,
        retailer,
        RADId,
      },
      { new: true }
    );
    return result;
  },
  delete: async (_id) => {
    const result = await adminUserModel.findOneAndUpdate(
      { _id },
      { deleted: false }
    );
    return result;
  },
};

module.exports = adminUserServices;
