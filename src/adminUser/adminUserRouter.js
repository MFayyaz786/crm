const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const adminUserServices = require("./adminUserServices");
const jwtServices = require("../utils/jwtServices");
const OTP = require("../utils/OTP.js");
const passwordValidator = require("../utils/passwordValidator");
//const sendEmail = require("../utils/sendEmail");
const { v4: uuidv4 } = require("uuid");
const validateMobileNo = require("../utils/validateMobileNo");
const authIdServices = require("../auth/authIdServices");
const roleModel = require("../rolePermission/roleModel");
const adminUserRouter = express.Router();
adminUserRouter.get(
  "/all",
  expressAsyncHandler(async (req, res) => {
    const { compony } = req.query;
    const result = await adminUserServices.get(compony);
    res.status(200).send({ msg: "users", data: result });
  })
);
adminUserRouter.get(
  "/userDetails",
  expressAsyncHandler(async (req, res) => {
    let { userId } = req.query;
    const result = await adminUserServices.getByUserID(userId);
    if (result) {
      return res.status(200).send({ msg: "user", data: result });
    } else {
      return res.status(400).send({ msg: "User Not Found" });
    }
  })
);

adminUserRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    let {
      compony,
      createdBy,
      roleId,
      name,
      email,
      password,
      // agentType,
      // master,
      // distributer,
      // retailer,
      RADId,
      contact,
      city,
      address,
      zip,
      state,
    } = req.body;
    if (
      !compony ||
      !createdBy ||
      !name ||
      !roleId ||
      !email ||
      !password ||
     // !agentType ||
      !contact ||
      !city ||
      !address ||
      !zip ||
      !state
    ) {
      return res.status(400).send({ msg: "Fields Missing" });
    }
    const roleType = await roleModel.findOne({ _id: roleId });
    if (roleType.role === "Super_Admin") {
      return res.status(400).send({
        msg: "You don't have permission to add user with super admin role!",
      });
    }
    const User = await adminUserServices.isUser(compony, email);
    if (!passwordValidator.schema.validate(password)) {
      return res.status(400).send({
        msg: "Password must have at least:1 uppercase letter,1 lowercase letter,1 number and 1 special character",

        //validator.schema.validate(password, { list: true }),
      });
    }
    // const isValid = validateMobileNo(contact);
    // console.log(isValid);
    // if (!isValid) {
    //   return res
    //     .status(400)
    //     .send({ msg: `${contact} is not a valid mobile number` });
    // }

    if (User) {
      return res.status(400).send({
        msg: "This email already registered",
      });
    }
    // switch (agentType) {
    //   case "master":
    //     master = null;
    //     break;
    //   case "distributer":
    //     if (!master) {
    //       return res.status(400).send({ msg: "Fields Missing" });
    //     }
    //     break;
    //   case "retailer":
    //     if (!master || !distributer) {
    //       return res.status(400).send({ msg: "Fields Missing" });
    //     }
    //     break;
    //   case "employee":
    //     if (!master || !distributer || !retailer) {
    //       return res.status(400).send({ msg: "Fields Missing" });
    //     }
    //     break;
    // }
    const result = await adminUserServices.addNew(
      compony,
      createdBy,
      roleId,
      name,
      email,
      password,
      RADId,
      contact,
      city,
      address,
      zip,
      state,
      RADId
    );
    if (result) {
      const uuid = uuidv4();
      const refreshToken = jwtServices.create({ uuid, type: "admin" });
      const accessToken = jwtServices.create(
        { userId: result._id, type: "admin" },
        "5m"
      );
      authIdServices.add(result._id, uuid);
      return res.status(201).send({
        msg: "User Registered Successfully",
        data: result,
        refreshToken,
        accessToken,
      });
    } else {
      return res.status(400).send({ msg: "User Not Registered!" });
    }
  })
);
adminUserRouter.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ msg: "Fields Missing" });
    }
    const user = await adminUserServices.login(email);
    console.log("user", user);
    if (user) {
      const validatePassword = await adminUserServices.validatePassword(
        password,
        user.password
      );
      if (validatePassword) {
        res.status(200).send({
          msg: "Login Successfully",
          data: user,
        });
      } else {
        res.status(401).send({
          msg: "Invalid Credentials!",
        });
      }
    } else {
      res.status(401).send({
        msg: "Invalid Credentials!",
      });
    }
  })
);
adminUserRouter.post(
  "/sendOtp",
  expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    // const otp = OTP();
    let otp = 1111;
    const result = await adminUserServices.updateOtp(email, otp);
    if (result) {
      // const sendMail = await sendEmail(email, otp);
      // if (!sendMail) {
      //   res.status(400).json({ msg: "OTP not sent" });
      // }
      res.status(200).json({ msg: "OTP sent" });
    } else {
      res.status(400).json({ msg: "OTP not sent" });
    }
  })
);
adminUserRouter.post(
  "/verifyOtp",
  expressAsyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const verifyExpireOtp = await adminUserServices.otpExpiryValidation(email);
    console.log("expire", verifyExpireOtp);
    if (!verifyExpireOtp) {
      res.status(400).send({
        msg: "Otp Expire please try again!",
      });
    } else {
      const verifyOtp = await adminUserServices.verifyOTP(email, otp);
      if (verifyOtp) {
        res.status(200).send({ msg: "OTP Verified" });
      } else {
        res.status(400).send({ msg: "Invalid OTP" });
      }
    }
  })
);
adminUserRouter.post(
  "/resetPassword",
  expressAsyncHandler(async (req, res) => {
    const { userId, password, reEnterPassword } = req.body;
    console.log(password, reEnterPassword);
    if (password !== reEnterPassword) {
      return res.status(400).send({ msg: "Passwords Don't Match" });
    }
    if (!passwordValidator.schema.validate(password)) {
      return res.status(400).send({
        msg: "Password must have at least:1 uppercase letter,1 lowercase letter,1 number and 1 special character",

        //validator.schema.validate(password, { list: true }),
      });
    }
    const result = await adminUserServices.setNewPassword(userId, password);
    if (result) {
      res.status(200).json({ msg: "Password reset!", data: result });
    } else {
      res.status(400).json({ msg: "password failed to reset" });
    }
  })
);
adminUserRouter.post(
  "/forgotPassword",
  expressAsyncHandler(async (req, res) => {
    const { email, password, reEnterPassword } = req.body;
    if (!email || !password || !reEnterPassword) {
      return res.status(400).send({ msg: "Fields Missing" });
    }
    if (password !== reEnterPassword) {
      res.status(400).send({
        msg: "Password And reEnterPassword don't Match",
      });
    }
    if (!passwordValidator.schema.validate(password)) {
      return res.status(400).send({
        msg: "Password must have at least:1 uppercase letter,1 lowercase letter,1 number and 1 special character",

        //validator.schema.validate(password, { list: true }),
      });
    }
    const result = await adminUserServices.forgotPassword(email, password);
    if (result) {
      return res
        .status(200)
        .send({ msg: "Password has been changed successfully" });
    } else {
      return res.status(400).send({ msg: "Password not Updated" });
    }
  })
);
adminUserRouter.patch(
  "/",
  expressAsyncHandler(async (req, res) => {
    let {
      compony,
      userId,
      updatedBy,
      roleId,
      name,
      contact,
      // agentType,
      // master,
      // distributer,
      // retailer,
      city,
      address,
      zip,
      state,
      RADId,
    } = req.body;
    // if (!agentType) {
    //   return res.status(400).send({ msg: "Fields Missing" });
    // }
    // switch (agentType) {
    //   case "master":
    //     master = null;
    //     break;
    //   case "distributer":
    //     if (!master) {
    //       return res.status(400).send({ msg: "Fields Missing" });
    //     }
    //     break;
    //   case "retailer":
    //     if (!master || !distributer) {
    //       return res.status(400).send({ msg: "Fields Missing" });
    //     }
    //     break;
    //   case "employee":
    //     if (!master || !distributer || !retailer) {
    //       return res.status(400).send({ msg: "Fields Missing" });
    //     }
    //     break;
    // }
    const result = await adminUserServices.update(
      compony,
      userId,
      updatedBy,
      roleId,
      name,
      contact,
      city,
      address,
      zip,
      state,
      RADId
    );
    if (result) {
      return res.status(200).send({ msg: "User profile reset", data: result });
    } else {
      return res.status(400).send({ msg: "Failed to reset" });
    }
  })
);
adminUserRouter.delete(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).send({ msg: "Fields Missing" });
    }
    const result = await adminUserServices.delete(userId);
    if (result.deletedCount == 0) {
      return res.status(400).send({ msg: "ID Not found" });
    }
    if (result) {
      return res.status(200).send({ msg: "User deleted.", data: result });
    } else {
      return res.status(400).send({ msg: "User not deleted" });
    }
  })
);

module.exports = adminUserRouter;
