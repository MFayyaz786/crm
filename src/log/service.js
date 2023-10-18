const model = require("./model");
//hello update
const service = {
  new: async (path, request) => {
    const result = await model.create({ path, request });
    return result;
  },
  updateResponse: async (_id, response) => {
    const result = await model.findOneAndUpdate(
      { _id },
      { response },
      { new: true }
    );
    return result;
  },
};

module.exports = service;
