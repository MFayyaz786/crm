const mongoose = require("mongoose");
const { isValidPassword } = require("mongoose-custom-validators");
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    compony: {
      type: Schema.Types.ObjectId,
      ref: "ServiceProvider",
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: isValidPassword,
        message:
          "Password must have at least: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
      },
    },
    // agentType: {
    //   type: String,
    //   enum: ["manager", "retailer", "distributer", "employee"],
    // },
    // master: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "User",
    // },
    // distributer: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "User",
    // },
    // retailer: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "User",
    // },
    RADId: {
      type: Number,
      default: null,
    },
    contact: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    zip: {
      type: String,
    },
    state: {
      type: String,
    },
    otp: {
      type: Number,
      default: null,
    },
    otpExpire: {
      type: Date,
    },
    token: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
    disabledDate: {
      type: Date,
      default: Date.now(),
    },
    isLogin: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const adminUserModel = new mongoose.model("User", schema);
module.exports = adminUserModel;
