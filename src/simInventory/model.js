// sim.js
const mongoose = require('mongoose');
// Define the SIM schema
const simSchema = new mongoose.Schema({
    serviceProvider:{
    type:mongoose.Types.ObjectId,
    ref:"ServiceProvider"
  },
  carrier:{
    type:mongoose.Types.ObjectId,
    ref:"Carrier"
  },  
  number: {
    type: String,
    required: true,
    unique: true,
  },
  esn: {
    type: String,
    required: true,
    unique: true,
  },
  pin: {
    type: String,
    required: true,
  },
  puk: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'in_use', 'deactivated'],
    default: 'available',
  },
});

// Create the SIM model
const model = mongoose.model('Sim', simSchema);
module.exports = model;
