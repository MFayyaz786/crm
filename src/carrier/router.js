const express = require("express");
const controller = require("./controller");
const router = express.Router();
router.get("/all", controller.getAll);
router.get("/details", controller.getOne);
router.post("/", controller.create);
router.patch("/", controller.update);
router.delete("/", controller.delete);

module.exports = router;
