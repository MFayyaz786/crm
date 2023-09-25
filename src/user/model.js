const mongoose = require("mongoose");
const { isValidPassword } = require("mongoose-custom-validators");
const { PROSPECTED } = require("../utils/userStatus");
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    serviceProvider:{
      type:Schema.Types.ObjectId,
      ref:"ServiceProvider"
    },
    csr: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    enrollmentId: {
      type: String,
    },
    firstName: {
      type: String,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    suffix: {
      type: String,
    },
    //social security number
    SSN: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      // validate: {
      //   validator: function (v) {
      //     return /^[\w\d]+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);;
      //   },
      //   message: "Please enter a valid email",
      // },
    },
    password: {
      type: String,
      validate: {
        validator: isValidPassword,
        message:
          "Password must have at least: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
      },
    },
    contact: {
      type: String,
    },
    city: {
      type: String,
    },
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    zip: {
      type: String,
    },
    state: {
      type: String,
    },
    isTemporaryAddress: {
      type: Boolean,
    },
    drivingLicense: {
      type: String,
    },
    DOB: {
      type: Date,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
    //best way to reach customer
    bestWayToReach: {
      type: String,
      enum: ["email", "phone", "text", "call"],
    },
    //who received government assistant (Supplemental Nutrition Assistance Program)
    isSelfReceive: {
      type: Boolean,
    },
    isReadyToGetServices:{
      type:Boolean
    },
    //connectivity plan type
    plan: {
      type: mongoose.Types.ObjectId,
      ref: "Plan",
      ///enum: ["lite", "extreme", "plus"],
    },
    //affordable connectivity program consent (ACP)
    isACP: {
      type: Boolean,
    },
    livesWithAnotherAdult: {
      type: Boolean,
    },
    hasAffordableConnectivity: {
      type: Boolean,
    },
    isSharesIncomeAndExpense: {
      type: Boolean,
    },
    acpProgram: {
      type: Schema.Types.ObjectId,
      ref: "ACPPrograms",
    },
    isEnrollmentComplete: {
      type: Boolean,
      default: false,
    },
    isAgreeToTerms: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    eligibility: {
      type: Boolean,
      default: false,
    },
    carrier: {
      type: Schema.Types.ObjectId,
      ref:"Carrier"
    },
    isProofed: {
      type: Boolean,
      default: false,
    },
    step:{
      type:Number,
      default:1
    },
    status: {
      type: String,
      default: PROSPECTED,
    },
    isSelfEnrollment:{
      type:Boolean,
      default:false
    },
    isTerribleTerritory:{
      type:Boolean,
      default:false
    },
    isBillAddress:{
      type:Boolean,
      default:false
    },
    deleted:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

const model = new mongoose.model("Customer", schema);
module.exports = model;
