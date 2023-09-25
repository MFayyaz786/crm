const express = require("express");
const router = express.Router();
const controller = require("./controller");
router.get("/all", controller.getAll);
router.get("/userDetails", controller.getOne);
router.post("/verifyZip", controller.verifyZip);
router.post("/initialInformation", controller.initialInformation);
router.post("/homeAddress", controller.homeAddress);
router.post("/selectProgram", controller.acpProgram);
router.post("/question", controller.question);
router.post("/termsAndConditions", controller.termsAndConditions);
router.post("/plan", controller.selectPlan);
router.post("/handOverEnrollment", controller.handOver);
router.get("/completeEnrollmentUser", controller.completeEnrollmentUserList);
router.get("/rejectedEnrollmentUser", controller.rejectedEnrollmentUserList);
router.get(
  "/inCompleteEnrollmentUser",
  controller.inCompleteEnrollmentUserList
);
router.get("/proofedEnrollmentUser", controller.proofedEnrollmentUserList);
router.get(
  "/withoutProofedEnrollmentUser",
  controller.withoutProofedEnrollmentUserList
);
// router.post("/q2", controller.q2);
// router.post("/q3", controller.q3);
router.post("/login", controller.login);
router.post("/sendOtp", controller.sendOtp);
router.post("/verifyOtp", controller.verifyOtp);
router.post("/resetPassword", controller.resetPassword);
router.post("/forgotPassword", controller.forgotPassword);
router.post("/updateStatus", controller.updateStatus);
router.patch("/", controller.update);
router.delete("/", controller.delete);
module.exports = router;
