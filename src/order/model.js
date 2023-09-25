const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  serviceProvider: {
    type: mongoose.Types.ObjectId,
    ref: "ServiceProvider",
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  carrier: {
    type: mongoose.Types.ObjectId,
    ref: "Carrier",
    default:null
  },
  esn: {
    type: String,
    default: null,
  },
  mdn: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    enum: ["hand-to-hand", "shipment", "byod"],
    required: true,
  },
  hasDevice: {
    type: Boolean,
    default: false,
  },
  isHandOverOrder: {
    type: Boolean,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", serviceSchema);
