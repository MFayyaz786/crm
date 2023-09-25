const { default: mongoose, trusted } = require("mongoose");
const model = require("./model");
const deviceStatus=require("../utils/deviceStatus")
module.exports = {
  bulkInsert: async (dataArray) => {
    const insertedData = await insertBulkData(dataArray);
    return insertedData;
  },
  getAll: async (serviceProvider) => {
    const result = await model.find({ serviceProvider });
    return result;
  },
  getAlignDevices: async (serviceProvider) => {
    const result = await model.find({
      serviceProvider: serviceProvider,
      status: deviceStatus.INUSE,
    });
    return result;
  },
  getFreeDevices: async (serviceProvider) => {
    const result = await model.find({
      serviceProvider: serviceProvider,
      status: deviceStatus.AVAILABLE,
    });
    return result;
  },
  getByESN: async (serviceProvider, esn) => {
    const result = await model.findOne({
      serviceProvider: serviceProvider,
      esn: esn,
    });
    return result;
  },
  checkAvailability: async (serviceProvider,carrier, esn) => {
    const result = await model.findOne({
      serviceProvider: serviceProvider,
      carrier:carrier,
      esn: esn,
      status:"available"
    });
    return result;
  },
};
const insertBulkData = async (dataArray) => {
  const session = await model.startSession();
  session.startTransaction();
  try {
    const insertedData = await model.insertMany(dataArray, { session });
    await session.commitTransaction();
    session.endSession();
    return insertedData;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}
