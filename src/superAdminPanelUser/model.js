const mongoose = require("mongoose");
//const { isValidPassword } = require("mongoose-custom-validators");
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    //super admin user panel
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
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
      //   validate: {
      //     validator: isValidPassword,
      //     message:
      //       "Password must have at least: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
      //   },
    },
    contact: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    cnic: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
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
    createdDate: {
      type: Date,
      default: Date.now,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const model = new mongoose.model("SuperAdminUser", schema);
module.exports = model;
