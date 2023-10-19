const express = require("express");
const dotenv = require("dotenv");
var morgan = require("morgan");
var cors = require("cors");
//
const path = require("path");
const moduleRouter = require("./src/rolePermission/ModuleRouter");
const subModuleRouter = require("./src/rolePermission/subModuleRouter");
const roleRouter = require("./src/rolePermission/roleRouter");
const adminUserRouter = require("./src/adminUser/adminUserRouter");
const userGroupRouter = require("./src/userGroup/userGroupRouter");
const userRouter = require("./src/user/router");
const serviceAreaRouter = require("./src/serviceArea/router");
const globalErrorHandler = require("./src/middleware/globalErrorHandler");
const acpProgramsRouter = require("./src/acpPrograms/router");
const planRouter = require("./src/plan/router");
const serviceRouter = require("./src/order/router");
const orderRouter = require("./src/order/router");
const superAdminPanelRole = require("./src/superAdminPanelRole/router");
const superAdminPanelUserRouter = require("./src/superAdminPanelUser/router");
const serviceProviderRouter = require("./src/serviceProvider/router");
const carrierRouter = require("./src/carrier/router");
const assignCarrierRouter = require("./src/assignCarrier/router");
const deviceInventoryRouter = require("./src/deviceInventory/router");
const simInventoryRouter = require("./src/simInventory/router");
const billingRouter = require("./src/billing/billingRouter");
const companyRouter = require("./src/company/router");
const middlewareCompanyRouter = require("./src/middlewareCompany/router");
const logs = require("./src/middleware/loggerMiddlerware");
const logModel = require("./src/log/model");
const dashboardRouter = require("./src/dashboard/router");
const selfEnrollmentRouter = require("./src/userSelfEnrollment/router");
const SMSRouter = require("./src/SMS/SMSRouter");
const usaDataRouter = require("./src/utils/usaData");
const permissionRouter = require("./src/rolePermission/permissionRouter");
const mailerRoute = require("./src/companyMailCredential/companyMailRouter");
const networkTypeRouter = require("./src/network/networkRoutes");
const simTypeRouter = require("./src/SimType/simTypeRoutes");
const deviceOSRouter = require("./src/operatingSystem/operatingSystemRoutes");
const dataCapableRouter = require("./src/deviceDataCapable/dataCapableRoutes");
const gradeRouter = require("./src/deviceGrade/gradeRoutes");
const deviceTypeRouter = require("./src/deviceType/deviceTypeRoutes");
const imeiTypeRouter = require("./src/imeiType/imeiTypeRoutes");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(logs);
//require("./src/config/db");
const port = process.env.PORT || 2023;
//hit routes
app.use((req, res, next) => {
  console.log(`Route called: ${req.originalUrl}`);
  next();
});
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
//app.use(decryptData);//Cipher
//app.use(limiter); //Limit IP Requests
//cors
// var corOptions = {
//   origin: "*",
// };
app.use(morgan("dev"));
//logger

//web routes
app.use("/api/web/module", moduleRouter);
app.use("/api/web/subModule", subModuleRouter);
app.use("/api/web/role", roleRouter);
app.use("/api/web/user", adminUserRouter);
//app.use("/api/web/customer", userRouter);
app.use("/api/web/group", userGroupRouter);
app.use("/api/web/serviceArea", serviceAreaRouter);
app.use("/api/web/acpPrograms", acpProgramsRouter);
app.use("/api/web/plan", planRouter);
app.use("/api/web/service", serviceRouter);
app.use("/api/web/order", orderRouter);
app.use("/api/web/superAdminPanelRole", superAdminPanelRole);
app.use("/api/web/superAdminPanelUser", superAdminPanelUserRouter);
app.use("/api/web/serviceProvider", serviceProviderRouter);
app.use("/api/web/carrier", carrierRouter);
app.use("/api/web/assignCarrier", assignCarrierRouter);
app.use("/api/web/deviceInventory", deviceInventoryRouter);
app.use("/api/web/simInventory", simInventoryRouter);
app.use("/api/web/billing", billingRouter);
app.use("/api/web/company", companyRouter);
app.use("/api/web/middlewareCompany", middlewareCompanyRouter);
app.use("/api/web/dashboard", dashboardRouter);
app.use("/api/web/permission", permissionRouter);
app.use("/api", usaDataRouter);

app.use("/api/user", userRouter);
app.use("/api/enrollment", selfEnrollmentRouter);
app.use("/api/sms", SMSRouter);
app.use("/api/mailer", mailerRoute);
app.use("/api/network", networkTypeRouter);
app.use("/api/simType", simTypeRouter);
app.use("/api/deviceOS", deviceOSRouter);
app.use("/api/deviceData", dataCapableRouter);
app.use("/api/grade", gradeRouter);
app.use("/api/deviceType", deviceTypeRouter);
app.use("/api/imeiType", imeiTypeRouter);

//404 Handler
app.get("/", (req, res, next) => {
  res.status(200).send({ msg: "Welcome To CRM " });
});
app.use((req, res, next) => {
  res.status(404).send({ msg: "Route Not found" });
});
app.use(globalErrorHandler);
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
