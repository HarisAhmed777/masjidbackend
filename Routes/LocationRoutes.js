// routes/authRoutes.js
const express = require('express');
const {location} = require('../Controllers/LocationControllers')
const router = express.Router();
router.post('/location',location);

module.exports = router;
