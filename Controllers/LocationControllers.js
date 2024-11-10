const User = require('../Models/User');


const location = async (req, res) => {
    const { email } = req.body;
    console.log("Hello from location route");
    try {
        // Fetch user's location data based on the email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Location data not found' });
        }

        // Correctly access latitude and longitude
        const { latitude, longitude } = user;
        console.log(latitude, longitude);

        // Send the latitude and longitude back to the frontend
        res.status(200).json({ latitude, longitude });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching location data', error });
    }
};



module.exports={
    location
}