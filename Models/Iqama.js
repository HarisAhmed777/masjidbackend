// models/Iqama.js
const mongoose = require('mongoose');

const iqamaSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  email:{
    type:String,
    required:true
  },
  times: {
    fajr: {
      hour: { type: String, default: "" },
      minute: { type: String, default: "" },
      amPm: { type: String, default: "" },
      offset: { type: String, default: "" },
    },
    dhuhr: {
      hour: { type: String, default: "" },
      minute: { type: String, default: "" },
      amPm: { type: String, default: "" },
      offset: { type: String, default: "" },
    },
    asr: {
      hour: { type: String, default: "" },
      minute: { type: String, default: "" },
      amPm: { type: String, default: "" },
      offset: { type: String, default: "" },
    },
    maghrib: {
      hour: { type: String, default: "" },
      minute: { type: String, default: "" },
      amPm: { type: String, default: "" },
      offset: { type: String, default: "" },
    },
    isha: {
      hour: { type: String, default: "" },
      minute: { type: String, default: "" },
      amPm: { type: String, default: "" },
      offset: { type: String, default: "" },
    },
  },
});

module.exports = mongoose.model('Iqama', iqamaSchema);
