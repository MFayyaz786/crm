const invoiceNo = require("../utils/invoiceNo");
const billingModel = require("./billingModel");
const Billing = require("./billingModel");
const planModel=require("../plan/model")

const billingServices = {
  getAll: async () => {
    const result = await Billing.find()
      .populate("userId")
      .populate("service_id");
    return result;
  },

  getById: async (id) => {
    const result = await Billing.findById(id)
      .populate("userId")
      .populate("service_id");
    return result;
  },

  create: async (
    userId,
    serviceProvider,
    invoiceNo,
    invoiceType,
    payment_method,
    cycleDate,
    planRental,
    tax,
    processingFee,
    additionalCharges,
    mergeInvoiceAmount,
    monthlyBill,
    previousDues,
    advanceAdjust,
    invoiceBalance,
    createdApplied,
    lateFee,
    IOTChildDue,
    total,
    amount_paid,
    totalDues,
    dueDate,
    dueGraceDate,
    lateFeeApplication,
    createdBy,
    createdDate,
    source,
    payment_date,
    paidUsing,
    is_paid
  ) => {
    const newBilling = new Billing({
      userId,
      serviceProvider,
      invoiceNo,
      invoiceType,
      payment_method,
      cycleDate,
      planRental,
      tax,
      processingFee,
      additionalCharges,
      mergeInvoiceAmount,
      monthlyBill,
      previousDues,
      advanceAdjust,
      invoiceBalance,
      createdApplied,
      lateFee,
      IOTChildDue,
      total,
      amount_paid,
      totalDues,
      dueDate,
      dueGraceDate,
      lateFeeApplication,
      createdBy,
      createdDate,
      source,
      payment_date,
      paidUsing,
      is_paid,
    });
    const result = await newBilling.save();
    return result;
  },
createBill:async(serviceProvider,userId,type,plan)=>{
const userPlan=await planModel.findOne({_id:plan});
const now = new Date();
let cycleDate = now.toLocaleDateString("en-US", { timeZone: "America/New_York" });
cycleDate=new Date(cycleDate)
cycleDate.setDate(cycleDate.getDate()+1)
console.log(cycleDate); // Output: "5/25/2023" (or a similar format)
let otherDate = new Date(cycleDate);
otherDate.setDate(otherDate.getDate() + 30);

// Formatting cycleDate and otherDate in the desired format
let formattedCycleDate = cycleDate.toISOString().split('T')[0];
let formattedOtherDate = otherDate.toISOString().split('T')[0];

// Creating the billing cycle string
let billingCycle = formattedCycleDate + " To " + formattedOtherDate;

console.log(billingCycle);
const dueDate = new Date(cycleDate);
dueDate.setDate(dueDate.getDate() + 15);
console.log(dueDate);
const dueGraceDate=new Date(dueDate);
dueGraceDate.setDate(dueGraceDate.getDate()+5);
console.log(dueGraceDate);
const invoice=await invoiceNo();
console.log(invoice)
const data = new billingModel({
  serviceProvider,
  userId,
  invoiceNo:invoice,
  invoiceType: type,
  billCycle:billingCycle,
  cycleDate,
  dueDate,
  dueGraceDate,
  createdDate: cycleDate,
  planRental:userPlan.price,
  
});
const result =await data.save();
console.log("result",result)
return result;
},
  update: async (
    _id,
    payment_method,
    amount_due,
    amount_paid,
    payment_date
  ) => {
    const result = await billingModel.findOneAndUpdate(
      { _id },
      { payment_method, amount_due, amount_paid, payment_date },
      { new: true }
    );
    return result;
  },
  delete: async (_id) => {
    const result = await billingModel.deleteOne({ _id });
    return result;
  },
};
module.exports = billingServices;
