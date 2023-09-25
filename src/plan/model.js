const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const planSchema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: "SuperAdminUser" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "SuperAdminUser" },
  serviceProvider: {
    type: Schema.Types.ObjectId,
    ref: "ServiceProvider",
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["prepaid", "postpaid", "data-only"],
    required: true,
  },
  dataAllowance: {
    type: Number,
    required: true,
  },
  dataAllowanceUnit: {
    type: String,
    enum: ["MB", "GB", "TB"],
    default: "GB",
  },
  voiceAllowance: {
    type: Number,
    required: true,
  },
  voiceAllowanceUnit: {
    type: String,
    enum: ["minutes"],
    default: "minutes",
  },
  textAllowance: {
    type: Number,
    required: true,
  },
  textAllowanceUnit: {
    type: String,
    enum: ["SMS"],
    default: "SMS",
  },
  duration: {
    type: Number,
    required: true,
  },
  durationUnit: {
    type: String,
    enum: ["days", "hours", "month", "year"],
    default: "days",
  },
  price: {
    type: Number,
    required: true,
  },
  additionalFeatures: [
    {
      type: String,
    },
  ],
  termsAndConditions: {
    type: String,
  },
  restrictions: [
    {
      type: String,
    },
  ],
  active: {
    type: Boolean,
    default: false,
  },
});

const model = mongoose.model("Plan", planSchema);

module.exports = model;
