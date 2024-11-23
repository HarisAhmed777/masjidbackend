require('dotenv').config();
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookie = require('cookie-parser');
const authRoutes = require('./Routes/AuthRoutes');
const cookieParser = require('cookie-parser');
const locationRoutes = require('./Routes/LocationRoutes')
const prayerTimingRoutes = require('./Routes/PrayerTimingRoutes');
const iqamaRoutes = require('./Routes/IqamaRoutes');

const app = express();

app.use(cors({
    origin: ["https://bejewelled-scone-32d0f8.netlify.app","http://localhost:5173"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb', extended:true,parameterLimit:50000}));
app.use(cookie());
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Database Connected");
}).catch((e) => {
    console.error("Error in connecting db", e);
});


app.use('/v1/signup',authRoutes);
app.use('/v1/user',authRoutes);
app.use('/v1/user',locationRoutes);
app.use('/v1/salah', prayerTimingRoutes);
app.use('/v1/iqama', iqamaRoutes);
app.use('/v1/salah',prayerTimingRoutes);
// app.use('/v1/prayertimings', prayerTimingRoutes);


app.listen(process.env.PORT, () => {
    console.log("Server is connected", process.env.PORT);
});