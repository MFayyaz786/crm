const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const router = express.Router();
const controller = require("./controller");
router.post("/", controller.add);
router.patch("/", controller.update);
router.get("/all", controller.get);
router.get("/getOne", controller.getOne);

module.exports = router;
