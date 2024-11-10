const express = require('express');
const router = express.Router();
const {
  showTodayTimings,
  savePrayerTimings,
  checkPrayerTimings
} = require('../Controllers/PrayerTimingsControllers');

// Endpoint to get today's prayer timings
router.post('/today', showTodayTimings);

// Endpoint to save adjusted prayer timings
router.post('/save', savePrayerTimings);
router.post('/check',checkPrayerTimings);


module.exports = router;
