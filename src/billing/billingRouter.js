const express = require("express");
const billingRouter = express.Router();
const billingServices = require("./billingServices");

// Get all billings
billingRouter.get("/", async (req, res) => {
  try {
    const result = await billingServices.getAll();
    res.status(200).send({ msg: "Bills", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Get a billing by ID
billingRouter.get("/getById", async (req, res) => {
  const { billId } = req.query;
  try {
    const result = await billingServices.getById(billId);
    if (result) {
      res.status(200).send({ msg: "Bill", data: result });
    } else {
      res.status(404).json({ msg: "Billing not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Create a new billing
billingRouter.post("/", async (req, res) => {
  const { user_id,
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
  is_paid } =
    req.body;
  try {
    const result = await billingServices.create(
      user_id,
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
    );
    res.status(200).send({ msg: "Bill created", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Update a billing by ID
billingRouter.put("/", async (req, res) => {
  const {
    billId,
    payment_method,
    amount_due,
    amount_paid,
    payment_date,
    is_paid,
  } = req.body;
  try {
    const result = await billingServices.update(
      billId,
      payment_method,
      amount_due,
      amount_paid,
      payment_date,
      is_paid
    );
    if (result) {
      res.status(200).send({ msg: "Bill updated", data: result });
    } else {
      res.status(404).json({ msg: "Billing not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Delete a billing by ID
billingRouter.delete("/", async (req, res) => {
  const billId = req.query;
  try {
    const result = await billingServices.delete(billId);
    if (result.deletedCount > 0) {
      res.status(200).send({ msg: "Billing deleted successfully" });
    } else {
      res.status(404).json({ msg: "Billing not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = billingRouter;
