// routes/authRoutes.js
const express = require('express');
const { signup, login } = require('../Controllers/AuthControllers');

const router = express.Router();

router.post('/newuser', signup);
router.post('/login', login);

module.exports = router;
