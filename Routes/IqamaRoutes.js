// routes/IqamaRoutes.js
const express = require('express');
const { addIqama , alliqmas,getcurrentiqaman ,updateiqama,deleteiqama} = require('../Controllers/IqamaControllers');
const { authenticate } = require('../Controllers/AuthControllers');
const router = express.Router();


// Route to add Iqama timings
router.post('/addiqama', authenticate,addIqama);
router.get('/alliqmas',authenticate,alliqmas);
router.get('/iqmah',authenticate,getcurrentiqaman);
router.post('/updateiqama',authenticate,updateiqama);
router.post ('/deleteiqama',authenticate,deleteiqama);

module.exports = router;
