const expressAsyncHandler = require("express-async-handler");
const service=require("./service")
exports.states = expressAsyncHandler(async (req, res) => {
  const result = await service.states();
  res.status(200).send({ msg: "states", data: result });
});