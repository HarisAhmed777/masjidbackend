// routes/authRoutes.js
const express = require('express');
const { signup, login ,authenticate,checkemail,accesstoken,sendemail,verifyemail,forgotpassword,resetpassword} = require('../Controllers/AuthControllers');

const router = express.Router();

router.post('/newuser', signup);
router.post('/login', login);
// router.get('/refresh-token',authenticate);
router.get('/checkemail',authenticate,checkemail);
router.get('/access-token',accesstoken);
router.put('/emailverified',verifyemail);
router.post('/sendemail',authenticate,sendemail);
router.post('/forgotpassword',forgotpassword);
router.put('/resetpassword',resetpassword);

module.exports = router;
