const model = require("./SMSModel");
const mongoose = require("mongoose");
const templateModel = require("./templateModel");
const service = {
  getDraftAll: async (templateId,compony) => {
    console.log("templateId: ", templateId);
    const result = await model
      .find({compony:compony, templateId: templateId, status: "Draft" })
      .populate({ path: "sentBy" })
      .populate({ path: "uploadedBy" });
    return result;
  },
  getSentAll: async (templateId,compony) => {
    console.log("templateId: ", templateId);
    const result = await model
      .find({compony:compony, templateId: templateId, status: "Sent" })
      .populate({ path: "sentBy" })
      .populate({ path: "uploadedBy" });
    return result;
  },
  addTemplate: async (
    company,
    name,
    templateId,
    template,
    keySequence,
    type
  ) => {
    const data = new templateModel({
      company,
      name,
      templateId,
      template,
      keySequence,
      type,
    });
    const result = await data.save();
    return result;
  },
  updateTemplate: async (templateId, name, template, keySequence, type) => {
    const data = await templateModel.findOneAndUpdate(
      { _id: templateId },
      { name, template, keySequence, type },
      { new: true }
    );
    const result = await data.save();
    return result;
  },
  getDraftAllTemplate: async (companyId) => {
    const result = await templateModel.aggregate([
      {
        $match: {
          company: new mongoose.Types.ObjectId(companyId),
          status: "Draft",
          deleted: false,
        },
      },
      {
        $lookup: {
          from: "sms",
          localField: "templateId",
          foreignField: "templateId",
          as: "sms",
        },
      },
      {
        $addFields: {
          sentSMSCount: {
            $sum: {
              $cond: [
                {
                  $in: ["Sent", "$sms.status"],
                },
                1,
                0,
              ],
            },
          },
          draftSMSCount: {
            $sum: {
              $cond: [
                {
                  $in: ["Draft", "$sms.status"],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          sms: 0,
        },
      },
    ]);
    //.find({ status: "Draft", active: true });
    return result;
  },
  getTemplateAll: async (companyId) => {
    const result = await templateModel.aggregate([
      {
        $match: {
          company: new mongoose.Types.ObjectId(companyId),
          deleted: false,
        },
      },
      {
        $lookup: {
          from: "sms",
          localField: "templateId",
          foreignField: "templateId",
          as: "sms",
        },
      },
      {
        $addFields: {
          sentSMSCount: {
            $sum: {
              $cond: [
                {
                  $in: ["Sent", "$sms.status"],
                },
                1,
                0,
              ],
            },
          },
          draftSMSCount: {
            $sum: {
              $cond: [
                {
                  $in: ["Draft", "$sms.status"],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          sms: 0,
        },
      },
    ]);
    //.find({ status: "Draft", active: true });
    return result;
  },
  getSentAllTemplate: async (companyId) => {
    const result = await templateModel.aggregate([
      {
        $match: {
          company: new mongoose.Types.ObjectId(companyId),
          status: "Sent",
          deleted: false,
        },
      },
      {
        $lookup: {
          from: "sms",
          localField: "templateId",
          foreignField: "templateId",
          as: "sms",
        },
      },
      {
        $addFields: {
          sentSMSCount: {
            $sum: {
              $cond: [
                {
                  $in: ["Sent", "$sms.status"],
                },
                1,
                0,
              ],
            },
          },
          draftSMSCount: {
            $sum: {
              $cond: [
                {
                  $in: ["Draft", "$sms.status"],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          sms: 0,
        },
      },
    ]);
    //.find({ status: "Sent", active: true });
    return result;
  },
  getOne: async (templateId) => {
    const result = await templateModel.findOne({ templateId: templateId });
    return result;
  },
  getAllTemplate: async (compony) => {
    const result = await templateModel.find({compony:compony, deleted: { $ne: true } });
    return result;
  },
};

module.exports = service;
