const model = require("./model");

const service = {
  get: async (serviceProvider) => {
    const result = await model
      .find({serviceProvider:serviceProvider,active:true});
      // .populate({
      //   path: "serviceProvider",
      //   select: { _id: 1, name: 1, email: 1, url: 1, contact: 1 },
      // })
      // .populate({
      //   path: "superAdminUser",
      //   select: { _id: 1, name: 1, email: 1, url: 1, contact: 1 },
      // });
    return result;
  },
  getSPPlan: async (serviceProvider) => {
    const result = await model.find({
      serviceProvider: { $eq: serviceProvider },
    });
    return result;
  },
  getOne: async (id) => {
    const result = await model.findById(id);
    return result;
  },
  updateStatus: async (_id,serviceProvider, updatedBy, status) => {
    const result = await model.findOneAndUpdate(
      { _id ,serviceProvider},
      { updatedBy, active: status }
    );
    return result;
  },
  create: async (
    createdBy,
    serviceProvider,
    name,
    description,
    type,
    dataAllowance,
    dataAllowanceUnit,
    voiceAllowance,
    voiceAllowanceUnit,
    textAllowance,
    textAllowanceUnit,
    duration,
    durationUnit,
    price,
    additionalFeatures,
    termsAndConditions,
    restrictions
  ) => {
    const data = new model({
      createdBy,
      serviceProvider,
      name,
      description,
      type,
      dataAllowance,
      dataAllowanceUnit,
      voiceAllowance,
      voiceAllowanceUnit,
      textAllowance,
      textAllowanceUnit,
      duration,
      durationUnit,
      price,
      additionalFeatures,
      termsAndConditions,
      restrictions,
    });
    const result = await data.save();
    return result;
  },
 bulkInsert :async (
  dataArray
) => {
  const insertedData = await insertBulkData(dataArray);
  return insertedData;
},
  updatePlan: async (
    updatedBy,
    serviceProvider,
    planId,
    name,
    description,
    type,
    dataAllowance,
    dataAllowanceUnit,
    voiceAllowance,
    voiceAllowanceUnit,
    textAllowance,
    textAllowanceUnit,
    duration,
    durationUnit,
    price,
    additionalFeatures,
    termsAndConditions,
    restrictions
  ) => {
    const result = await model.findOneAndUpdate(
      { _id: planId, serviceProvider: serviceProvider },
      {
        updatedBy,
        serviceProvider,
        planId,
        name,
        description,
        type,
        dataAllowance,
        dataAllowanceUnit,
        voiceAllowance,
        voiceAllowanceUnit,
        textAllowance,
        textAllowanceUnit,
        duration,
        durationUnit,
        price,
        additionalFeatures,
        termsAndConditions,
        restrictions,
      },
      { new: true }
    );
    return result;
  },
};

  (module.exports = service);
