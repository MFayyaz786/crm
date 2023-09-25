const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BillingSchema = new Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: "Customer" },
  serviceProvider: { type: mongoose.Types.ObjectId, ref: "ServiceProvider" },
  invoiceNo: {
    type: String,
  },
  invoiceType: {
    type: String,
    enum: ["Postpaid", "Prepaid", "lifeLine"],
    default: "Postpaid",
  },
  payment_method: {
    type: String,
    enum: ["Postpaid", "Prepaid"],
  },
  billCycle:{
    type:String,
  },
  cycleDate: { type: Date },
  planRental: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  processingFee: {
    type: Number,
    default: 0,
  },
  additionalCharges: {
    type: Number,
    default: 0,
  },
  mergeInvoiceAmount: {
    type: Number,
    default: 0,
  },
  monthlyBill: {
    type: Number,
    default: 0,
  },
  previousDues: {
    type: Number,
    default: 0,
  },
  advanceAdjust: {
    type: Number,
    default: 0,
  },
  invoiceBalance: {
    type: Number,
    default: 0,
  },
  createdApplied: {
    type: Number,
    default: 0,
  },
  lateFee: {
    type: Number,
    default: 0,
  },
  IOTChildDue: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  amount_paid: { type: Number, default: 0 },
  totalDues: {
    type: Number,
    default: 0,
  },
  dueDate: {
    type: Date,
    default: Date.now(),
  },
  dueGraceDate: {
    type: Date,
    default: Date.now,
  },
  lateFeeApplication: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdDate: { type: Date },
  source: { type: String, default: "Titan" },
  payment_date: { type: Date },
  paidUsing: { type: String },
  is_paid: { type: Boolean },
  // amount_due: { type: Number, required: true },
  // billing_date: { type: Date, required: true },
});
const billingModel = mongoose.model("Billing", BillingSchema);
module.exports = billingModel;
