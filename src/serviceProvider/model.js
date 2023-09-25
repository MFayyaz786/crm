const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ServiceProviderSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    alias: { type: String },
    type: { type: String,default:"local" },
    url: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    zipCode: { type: String,  required: true},
    country: { type: String, required: true},
    state: { type: String,required:true },
    address:{type:String},
    EIN:{type: String,required:true},
    subDomain: { type: String, required: true, unique: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "SuperAdminUser" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "SuperAdminUser" },
    active: {
      type: Boolean,
      default: true,
    },
    deleted:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);
const model=new mongoose.model("ServiceProvider",ServiceProviderSchema);
module.exports=model