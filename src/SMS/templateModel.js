const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const templateSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "serviceProvider",
    },
    name: { type: String },
    templateId: { type: String },
    template: { type: String },
    active: {
      type: Boolean,
      default: true,
    },
    keySequence: [{ type: String }],
    type: {
      type: Number,
      enum: [0, 1, 2],
    },
    status: {
      type: String,
      default: "Draft",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const model = new mongoose.model("Template", templateSchema);
module.exports = model;
