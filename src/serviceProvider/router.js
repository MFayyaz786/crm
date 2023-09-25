const express=require("express");
const controller=require("./controller")
const router=express.Router();
router.get("/all",controller.getAll);
router.get("/inActive",controller.inActive);
router.get("/details",controller.getOne);
router.post("/",controller.create);
router.patch("/",controller.update);
router.delete("/", controller.delete);
router.post("/requestOtp", controller.requestOtp);
router.post("/login", controller.login);
router.post("/verifyOtp", controller.verifyOtp);
router.post("/resetPassword", controller.resetPassword);
router.post("/forgotPassword", controller.forgotPassword);
router.patch("/updateStatus", controller.updateStatus);

router.delete("/", controller.delete);

module.exports=router