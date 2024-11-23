const mongoose = require('mongoose');

const timingSchema = new mongoose.Schema({
  fajr: String,
  dhuhr: String,
  asr: String,
  maghrib: String,
  isha: String,
});

const monthSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Example: 'November'
  timings: [
    {
      date: { type: String, required: true }, // Example: '01-11-2024'
      timings: timingSchema,
    },
  ],
});

const yearSchema = new mongoose.Schema({
  year: { type: Number, required: true }, // Example: 2024
  months: [monthSchema],
});

const prayerTimingSchema = new mongoose.Schema({
  email: { type: String, required: true },
  years: [yearSchema],
});

const PrayerTiming = mongoose.model('PrayerTiming', prayerTimingSchema);

module.exports = PrayerTiming;
