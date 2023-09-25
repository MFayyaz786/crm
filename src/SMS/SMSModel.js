const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SMSSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "serviceProvider",
    },
    mobileNo: { type: String },
    name: { type: String },
    trackingId: { type: String },
    templateId: { type: String },
    email: { type: String },
    sentBy: { type: Schema.Types.ObjectId, ref: "User" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    type: { type: Number },
    message: { type: String },
    isSent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Rejected"],
      default: "Draft",
    },
    reason: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const SMSModel = new mongoose.model("SMS", SMSSchema);
module.exports = SMSModel;
