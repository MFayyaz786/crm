const expressAsyncHandler = require("express-async-handler");
const authIdServices = require("../auth/authIdServices");
const service = require("./service");
const jwtService = require("../utils/jwtServices");
const { createNew, login, validatePassword,verifyOtp } = require("./validator");
const { v4: uuidv4 } = require("uuid");
const OTP = require("../utils/OTP");
const ApiError = require("../helpers/apiError");
//get all super admin panel user
exports.getAll = expressAsyncHandler(async (req, res) => {
  const result = await service.get();
  res.status(200).send({ msg: "users", data: result });
});
exports.inActive = expressAsyncHandler(async (req, res) => {
  const result = await service.inActive();
  res.status(200).send({ msg: "users", data: result });
});
exports.userDetails = expressAsyncHandler(async (req, res) => {
  let { userId } = req.query;
  const result = await service.getByUserID(userId);
  if (result) {
    return res.status(200).send({ msg: "user", data: result });
  } else {
    return res.status(400).send({ msg: "User Not Found" });
  }
});

exports.create = expressAsyncHandler(async (req, res,next) => {
  const { role, firstName,lastName, email, password, contact, cnic,address } = req.body;
  const validate = createNew.validate(req.body);
  if (validate.error) {
    return next(new ApiError(validate.error, 400));
  }
  const result = await service.addNew(
    role,
    firstName,lastName,
    email,
    password,
    contact,
    cnic,
    address
  );
  if (result) {
    const uuid = uuidv4();
    const refreshToken = jwtService.create({ uuid, type: "superAdmin" });
    const accessToken = jwtService.create(
      { userId: result._id, type: "superAdmin" },
      "5m"
    );
    authIdServices.add(result._id, uuid);
    return res.status(200).send({
      msg: "User Register successfully",
      data: result,
      accessToken,
      refreshToken,
    });
  } else {
    return res.status(400).send({ msg: "User Not added" });
  }
});
//login
exports.login = expressAsyncHandler(async (req, res,next) => {
  const { email, password } = req.body;
  const validate = login.validate(req.body);
  if (validate.error) {
    return next(new ApiError(validate.error, 400));
  }
  const user = await service.login(email);
  console.log(user);
  if (user) {
    const validatePassword = await service.validatePassword(
      password,
      user.password
    );
    if (validatePassword) {
      res.status(200).send({
        msg: "Logged in Successfully",
        data: user,
      });
    } else {
      res.status(400).send({
        msg: "Invalid Credentials!",
      });
    }
  } else {
    res.status(400).send({
      msg: "Invalid Credentials!",
    });
  }
});
//request otp
exports.requestOtp = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  const otp = OTP();
  console.log(otp)
  const result = await service.updateOtp(email, 1111);
  if (result) {
    //const sendMail = await sendEmail(email, otp);
    //   if (!sendMail) {
    //     res.status(400).json({ msg: "OTP not sent" });
    //   }
    res.status(200).json({ msg: "OTP sent" });
  } else {
    res.status(400).json({ msg: "OTP not sent" });
  }
});
//verify otp
exports.verifyOtp = expressAsyncHandler(async (req, res,next) => {
  const { email, otp } = req.body;
  const validate = verifyOtp.validate(req.body);
  if (validate.error) {
    return next(new ApiError(validate.error, 400));
  }
  const verifyExpireOtp = await service.otpExpiryValidation(email);
  if (!verifyExpireOtp) {
    res.status(400).send({
      msg: "Otp Expire please try again!",
    });
  } else {
    const verifyOtp = await service.verifyOTP(email, otp);
    if (verifyOtp) {
      res.status(200).send({ msg: "OTP Verified" });
    } else {
      res.status(400).send({ msg: "Invalid OTP" });
    }
  }
});
//reset password
exports.resetPassword = expressAsyncHandler(async (req, res,next) => {
  const { userId, password, reEnterPassword } = req.body;
  if (password !== reEnterPassword) {
    return res.status(400).send({ msg: "Passwords Don't Match" });
  }
  const validate = validatePassword.validate(req.body);
  if (validate.error) {
    return next(new ApiError(validate.error, 400));
  }
  const result = await service.setNewPassword(userId, password);
  if (result) {
    res.status(200).json({ msg: "Password reset!", data: result });
  } else {
    res.status(400).json({ msg: "password failed to reset" });
  }
});
//forgot password
exports.forgotPassword = expressAsyncHandler(async (req, res) => {
  const { email, password, reEnterPassword } = req.body;
  if (!email || !password || !reEnterPassword) {
    return res.status(400).send({ msg: "Fields Missing" });
  }
  if (password !== reEnterPassword) {
    res.status(400).send({
      msg: "Password And reEnterPassword don't Match",
    });
  }
  const result = await service.forgotPassword(email, password);
  if (result) {
    return res.status(200).send({ msg: "Password Updated", data: result });
  } else {
    return res.status(400).send({ msg: "Password not Updated" });
  }
});
//update profile
exports.updateProfile = expressAsyncHandler(async (req, res) => {
  const { userId, roleId, firstName,lastName, cnic, contact, address } = req.body;
  const result = await service.update(
    userId,
    roleId,
    firstName,
    lastName,
    cnic,
    contact,
    address
  );
  if (result) {
    return res.status(200).send({ msg: "User profile reset", data: result });
  } else {
    return res.status(400).send({ msg: "Failed to reset" });
  }
});
//update status
exports.updateStatus = expressAsyncHandler(async (req, res) => {
  const { userId, status } = req.body;
  const result = await service.updateStatus(userId, status);
  if (result) {
    return res.status(200).send({ msg: "User status reset", data: result });
  } else {
    return res.status(400).send({ msg: "Failed to reset" });
  }
});
//delete user
exports.delete = expressAsyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).send({ msg: "Fields Missing" });
  }
  const result = await service.delete(userId);
  if (result.deletedCount == 0) {
    return res.status(400).send({ msg: "ID Not found" });
  }
  if (result) {
    return res.status(200).send({ msg: "User deleted.", data: result });
  } else {
    return res.status(400).send({ msg: "User not deleted" });
  }
});
//refresh Token
exports.refreshToken=
  expressAsyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const verifyToken = jwtService.authenticate(refreshToken);
    if (verifyToken) {
      const { uuid, type } = verifyToken;
      const AuthId = await authIdServices.findByUUID(uuid);
      if (AuthId) {
        const { userId } = AuthId;
        if (userId) {
          const token = jwtService.createNew({ userId, type }, "5m");
          res.status(200).send({ msg: "", data: { token } });
        } else {
          res.status(401).send({ msg: "Login please" });
        }
        
      } else {
        res.status(401).send({ msg: "Login please" });
      }
    } else {
      res.status(401).send({ msg: "Login please" });
    }
  });
