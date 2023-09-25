// Required dependencies
const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const SMSService = require("../utils/SMSService");
const mailService = require("../utils/mailService");
const expressAsyncHandler = require("express-async-handler");
const SMSModel = require("./SMSModel");
const { default: mongoose } = require("mongoose");
const service = require("./service");
const SMSRouter = express.Router();
const templateModel = require("./templateModel");
// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Route for file upload
SMSRouter.post(
  "/upload/:id",
  upload.single("file"),
  expressAsyncHandler(async (req, res) => {
    const filePath = req.file.path;
    // Process the uploaded file
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // Extract the required data and send it back to the frontend
      const processedData = await processDataTest(req.params.id, data);
      res.json({ data: processedData });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  })
);

// Route for sending messages
SMSRouter.post(
  "/send",
  expressAsyncHandler(async (req, res) => {
    try {
      const { sentBy, templateId } = req.query;
      const data = await service.getDraftAll(templateId);
      const result = await mailService(data, sentBy, data.length);
      console.log("result: ", result);
      if (result) {
        res.status(200).send({ msg: "Messages queued and sent", data: data });
      } else {
        res.status(400).send({ msg: "Not Sent" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Failed!" });
    }
  })
);
SMSRouter.post(
  "/addTemplate",
  expressAsyncHandler(async (req, res) => {
    const { company, name, template, keySequence, type } = req.body;
    if (!company || !name || !template || keySequence.length === 0) {
      return res.status(400).send({ msg: "Fields Missing!" });
    }
    const templateId = Math.floor(1000 + Math.random() * 9000);
    const result = await service.addTemplate(
      company,
      name,
      templateId,
      template,
      keySequence,
      type
    );
    if (result) {
      return res.status(200).send({ msg: "added", data: result });
    } else {
      return res.status(400).json({ msg: "Failed!" });
    }
  })
);
SMSRouter.patch(
  "/updateTemplate",
  expressAsyncHandler(async (req, res) => {
    const { templateId, template, keySequence } = req.body;
    const result = await service.updateTemplate(
      templateId,
      template,
      keySequence
    );
    if (result) {
      return res.status(200).send({ msg: "Updated", data: result });
    } else {
      return res.status(400).json({ msg: "Failed!" });
    }
  })
);
SMSRouter.get(
  "/template/all",
  expressAsyncHandler(async (req, res) => {
    try {
      const { companyId } = req.query;
      const result = await service.getTemplateAll(companyId);
      res.status(200).send({ msg: "Template List", data: result });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed!" });
    }
  })
);
SMSRouter.get(
  "/template/draft",
  expressAsyncHandler(async (req, res) => {
    try {
      const { companyId } = req.query;
      const result = await service.getDraftAllTemplate(companyId);
      res.status(200).send({ msg: "Template List", data: result });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed!" });
    }
  })
);
SMSRouter.get(
  "/template/sent",
  expressAsyncHandler(async (req, res) => {
    try {
      const { companyId } = req.query;
      const result = await service.getSentAllTemplate(companyId);
      res.status(200).send({ msg: "Template List", data: result });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed!" });
    }
  })
);
SMSRouter.get(
  "/template/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const result = await service.getOne(req.params.id);
      if (result) {
        return res.status(200).send({ msg: "Template", data: result });
      } else {
        return res.status(404).send({ msg: "Not Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed!" });
    }
  })
);
SMSRouter.get(
  "/draft",
  expressAsyncHandler(async (req, res) => {
    try {
      const data = await service.getDraftAll(req.query.templateId,req.query.compony);
      res.status(200).send({ msg: "List", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to process the file" });
    }
  })
);
SMSRouter.get(
  "/sent",
  expressAsyncHandler(async (req, res) => {
    try {
      const data = await service.getSentAll(
        req.query.templateId,
        req.query.compony
      );
      res.status(200).send({ msg: "List", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to process the file" });
    }
  })
);
async function processDataTest(uploadedBy, data) {
  const template = await templateModel.findOne({ templateId: data[1][0] });
  console.log("template: ", template);
  if (!template) {
    throw new Error("Please add template first");
  }
  const processedData = await data.slice(1).map((row) => {
    console.log(template.keySequence);
    const rowData = {}; // Object to hold the mapped data for each row
    // Map the values from the 'row' array to their corresponding fields
    for (let i = 0; i < template.keySequence.length; i++) {
      rowData[template.keySequence[i]] = row[i];
    }
    // Find keys in the message template (e.g., $name, $trackingId)
    const dynamicKeys = template.template.match(/\$\w+/g);

    // Replace keys in the message with their corresponding values from the rowData
    let messageWithValues = template.template;
    if (dynamicKeys) {
      dynamicKeys.forEach((key) => {
        const dataKey = key.slice(1); // Remove the $ sign from the key
        const value = rowData[dataKey];
        messageWithValues = messageWithValues.replace(key, value);
      });
    }
    rowData.message = messageWithValues;
    rowData.uploadedBy = uploadedBy;
    rowData.company=template.company
    console.log("rowDate", rowData);
    return rowData;
  });
  const session = await mongoose.startSession();
  let savedData;
  try {
    session.startTransaction();
    savedData = await SMSModel.insertMany(processedData);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction aborted. Error: ", error);
    throw error;
  } finally {
    session.endSession();
  }

  return savedData;
}
// Example function to process the data
const processData = async (uploadedBy, data) => {
  console.log(data[1][0]);
  const template = await templateModel.findOne({ templateId: data[1][0] });
  if (!template) {
    throw new Error("Please add template first");
  }
  console.log(template);

  const processedData = await data.slice(1).map((row) => ({
    uploadedBy,
    mobileNo: row[0],
    trackingId: row[1],
    name: row[2],
    email: row[3],
    templateId: row[4],
    message: template.template
      .replace("${row[2]}", row[2])
      .replace("${row[1]}", row[1]),
  }));
  const session = await mongoose.startSession();
  let savedData;
  try {
    session.startTransaction();
    savedData = await SMSModel.insertMany(processedData);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction aborted. Error: ", error);
    throw error;
  } finally {
    session.endSession();
  }

  return savedData;
};

const saveData = async (processedData) => {
  let data = [];
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    for (var i = 0; i < processedData; i++) {
      user = new SMSModel({
        uploadedBy: processedData[i].uploadedBy,
        mobileNo: processedData[i].mobileNo,
        name: processedData[i].name,
        trackingId: processedData[i].trackingId,
        email: processedData[i].email,
        templateId: processedData[i].templateId,
        message: processedData[i].message,
      });
      const result = await user.save();
      data.push(result);
    }
    await session.commitTransaction();
    return data;
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction aborted. Error: ", error);
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
};

SMSRouter.get(
  "/getAllTemplate/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      //const result = await templateModel.find({deleted: {$ne: true}})
      const result = await service.getAllTemplate(req.params.id);
      res.status(200).send({ msg: "Templatess List", data: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Failed!" });
    }
  })
);

module.exports = SMSRouter;
