const jwt = require("jsonwebtoken");
const User = require("./Models/User");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Fetch user from database
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User does not exist" });

        // Check password validity
        const passwordValid = await user.isValidatePassword(password);
        if (!passwordValid) return res.status(400).json({ message: "Password is incorrect" });

        // Generate access and refresh tokens
        const accesstoken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });
        const refreshtoken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

        // Set tokens as httpOnly cookies
        res.cookie('accesstoken', accesstoken, {
            maxAge: 10 * 60 * 1000,  // 10 minutes
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  // Ensure HTTPS in production
            sameSite: 'Strict'  // Prevent CSRF
        });

        res.cookie('refreshtoken', refreshtoken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'Strict'
        });

        return res.status(200).json({ message: "Login Successful" });
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Server error", error });
    }
};
