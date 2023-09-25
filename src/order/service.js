const { default: mongoose } = require("mongoose");
const model = require("./model");
const simModel=require("../simInventory/model");
const deviceModel=require("../deviceInventory/model")
module.exports = {
  provideSim: async (
    serviceProvider,
    user,
    esn,
    mdn,
    carrier,
    type,
    hasDevice
  ) => {
    const now = new Date();
    let cycleDate = now.toLocaleDateString("en-US", {
      timeZone: "America/New_York",
    });
    cycleDate = new Date(cycleDate);
    cycleDate.setDate(cycleDate.getDate() + 1);
    const data = new model({
      serviceProvider: new mongoose.Types.ObjectId(serviceProvider),
      user: new mongoose.Types.ObjectId(user),
      carrier: new mongoose.Types.ObjectId(carrier),
      type,
      esn,
      mdn,
      hasDevice,
      date: cycleDate,
    });
    const result = await data.save();
    if (result && result.hasDevice === true) {
      await deviceModel.findOneAndUpdate(
        { mdn: mdn, carrier: carrier, serviceProvider: serviceProvider },
        { status: "in_use" },
        { new: true }
      );
    } else {
      await simModel.findOneAndUpdate(
        { mdn: mdn, carrier: carrier, serviceProvider: serviceProvider },
        { status: "in_use" },
        { new: true }
      );
    }
    return result;
  },
  getAll: async (serviceProvider) => {
    const result = await model
      .find({ serviceProvider: serviceProvider })
      .populate("user")
      .populate("carrier");
    return result;
  },
  getByESN: async (esn) => {
    const result = await model.findOne({ esn });
    return result;
  },
  getByMDN: async (mdn) => {
    const result = await model.findOne({ mdn });
    return result;
  },
  userServicesHistory: async (user) => {
    const result = await model.find({ user: { $in: user } });
    return result;
  },
  update: async (userId, esn, mdn, hasDevice) => {
    const result = await model.findOneAndUpdate(
      { user: userId },
      { esn, mdn, hasDevice },
      { new: true }
    );
  },
};
