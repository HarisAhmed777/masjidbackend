// routes/authRoutes.js
const express = require('express');
const {location ,latandlan} = require('../Controllers/LocationControllers');
const {authenticate} = require('../Controllers/AuthControllers');
const router = express.Router();
router.post('/location',location);
router.get('/latandlan',authenticate,latandlan);

module.exports = router;
