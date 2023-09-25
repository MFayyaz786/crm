const model = require("./model");
const projection = require("../config/mongoProjection");
const service = {
  getAll: async (serviceProvider) => {
    const result = await model.find({serviceProvider:{$eq:serviceProvider}}, projection.projection);
    console.log(result)
    return result;
  },
  create: async (serviceProvider,createdBy,name,description,banner) => {
    const data = new model({serviceProvider,createdBy, name, description, banner });
    const result = await data.save();
    return result;
  },
  getOne: async (id) => {
    const result = await model.findById(id, projection.projection);
    return result;
  },
  update:async(serviceProvider,updatedBy,_id,name,description,banner)=>{
    const result=await model.findOneAndUpdate({_id},{serviceProvider,updatedBy,name,description,banner});
    return result;
  }
};
module.exports = service;
