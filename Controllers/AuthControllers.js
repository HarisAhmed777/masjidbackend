// controllers/authController.js
const User = require('../Models/User');
const jwt = require('jsonwebtoken'); 




const signup = async (req, res) => {
    console.log('h1');
    try {
        const { masjidname, email, password,latitude,longitude } = req.body;
        console.log(masjidname,email,password,latitude,longitude);

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        console.log("this line");
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({ masjidname, email, password,latitude,longitude });
        await newUser.save();

        res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isValidPassword = await user.isValidPassword(password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT with email and user id
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Include email in the payload
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = {
    signup,
    login,
};
