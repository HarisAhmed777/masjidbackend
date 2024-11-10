const mongoose = require('mongoose');

const PrayerTimingSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: String, required: true },
  timings: {
    Fajr: { type: String, required: true },
    Dhuhr: { type: String, required: true },
    Asr: { type: String, required: true },
    Maghrib: { type: String, required: true },
    Isha: { type: String, required: true },
  },
});

module.exports = mongoose.model('PrayerTiming', PrayerTimingSchema);
