const express = require('express');
const {authenticate} =  require('../Controllers/AuthControllers')
const router = express.Router();
const {
  showTodayTimings,
  savePrayerTimings,
  checkPrayerTimings,
  uploadprayertimings,
  getsalahtimings,
} = require('../Controllers/PrayerTimingsControllers');

// Endpoint to get today's prayer timings
router.post('/today', showTodayTimings);
router.post('/uploadtimings',authenticate,uploadprayertimings);
// Endpoint to save adjusted prayer timings
router.post('/save', savePrayerTimings);
router.get('/home',authenticate,getsalahtimings);
router.post('/check',checkPrayerTimings);


module.exports = router;
