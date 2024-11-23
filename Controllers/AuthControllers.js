// controllers/authController.js
const User = require('../Models/User');
const jwt = require('jsonwebtoken'); 
const { jwtDecode } = require('jwt-decode');
var nodemailer = require("nodemailer");

// const cookie = require('cookie-parser')


function GenerateSequence(){
    var result = "";
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
    for(var i=0;i<3;i++){
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    const numbers = Math.floor(Math.random() * (1000 - 0 + 1)) + 0
    
    const finalresult = result + numbers;
    return finalresult ; 
  }

const signup = async (req, res) => {
    console.log('h1 from signup');
    try {
        const { address,city,country,location,postalcode,state,masjidname, email, password,latitude,longitude } = req.body;
        console.log(address,city,country,postalcode,state,masjidname, email, password,latitude,longitude );

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        console.log("this line");
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // const usercount = User.countDocuments({});
        // console.log(usercount);
        let MosqueId;
        let isUnique = false;

        while (!isUnique) {
            MosqueId = GenerateSequence(); // Generate 3-letter ID
            const existingId = await User.findOne({ MosqueId });
            if (!existingId) {
                isUnique = true;
            }
        }

        console.log("Generated unique MosqueId:", MosqueId);
        const newUser = new User({ MosqueId,masjidname, email, password,address,city,country,location,latitude,longitude,postalcode,state });
        await newUser.save();

        res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error', error });
    }
};

const login = async (req, res) => {
  console.log('helo from login');
    try {
        const { email, password } = req.body;
        console.log(email,password);

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
          console.log('no user');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isValidPassword = await user.isValidPassword(password);
        if (!isValidPassword) {
          console.log('heloform validate pass')
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT with email and user id
        const accesstoken = jwt.sign({email},process.env.ACCESS_TOKEN,{expiresIn:"10m"});
        const refreshtoken = jwt.sign({email},process.env.REFRESH_TOKEN,{expiresIn:"1d"});
        res.cookie('accesstoken',accesstoken,{
            maxAge:10*60*1000,
            httpOnly:true,
            secure:process.env.NODE_ENV ==="production",
            sameSite:'strict'

        });
        res.cookie('refreshtoken',refreshtoken,{
            maxAge:60*60*1000,
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:'strict'
        });
        console.log('data sent to frontend');
        res.status(200).json({ message: 'Login successful'});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
        console.log(error.message);
    }
};

const authenticate = async (req, res, next) => {
    try {
      const token = req.cookies.accesstoken;
      let decodetoken;
      
      if (!token) {
        const refreshtoken = req.cookies.refreshtoken;
        console.log(refreshtoken);
  
        if (!refreshtoken) return res.status(401).json({ authenticate: "false" });
  
        decodetoken = jwtDecode(refreshtoken);
        const accesstoken = jwt.sign({ email: decodetoken.email }, process.env.ACCESS_TOKEN, { expiresIn: '10m' });
        
        res.cookie('accesstoken', accesstoken, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: 'strict'
        });
      } else {
        decodetoken = jwtDecode(token);
      }
  
      req.email = decodetoken.email;
      next(); // Call next() only if no response has been sent
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
const accesstoken = async (req,res)=>{
    try{
        const token = req.cookies.accesstoken;
        if(!token){
            const refreshtoken = req.cookies.refreshtoken;
            console.log('abcd');
            if(!refreshtoken) return res.status(401),res.json({authenticate:false});
            const decode = jwtDecode(refreshtoken);
            const accesstoken = jwt.sign({email:decode.email},process.env.ACCESS_TOKEN,{expiresIn:'10m'});
            res.cookie('accesstoken',accesstoken,{
                maxAge:10*24*60*60*1000,
                httpOnly:true,
                secure:process.env.NODE_ENV==='production',
                sameSite:'strict'
            })
            console.log('This is from access Token');
            // res.status(200),res.json({authenticate:true});

        }
        res.status(200),res.json({authenticate:true});
    }
    catch(error){
        console.log(error);
    }
}
const checkemail =  async(req,res)=>{
    try{
        const email   =  req.email;
        const chkemail = await User.find({email:email,'isverified':{$exists:true}})
                if(chkemail.length===0) return res.status(200),res.json({isverified:false});
                res.status(200),res.json({isverified:true});
        
        }

    catch(error){
        console.log(error.message);
    }
}
// Adjust path to your User model

const verifyemail = async (req, res) => {
  try {
    // Get token from the request body
    const token = req.body.token;
    // Decode the token to extract the email
    const decode = jwtDecode(token);
    const email = decode.email;
    
    // Update the user's isverified field to true
    const result = await User.findOneAndUpdate(
      { email: email },      // Find user by email
      { isverified: true },  // Update isverified to true
      { new: true }          // Return the updated document
    );
    console.log(result);

    // Check if the user was found and updated
    if (!result) {
      return res.status(404).json({ message: "User not found or already verified" });
    }
    console.log("This is from last line before verifying email");
    res.status(200).json({ message: "Email verified successfully", user: result });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = verifyemail;


 
// const sendemail = async(req,res)=>{
//     try{
//         const email = req.email;
//         const secret = process.env.JWT_SECRET + {email};
//         const id = User.findOne({email:email});
//         const token = jwt.sign({email:email,id:id._id},secret,{expiresIn:'5m'});
//         const link = `${process.env.link}/${token}`; 
//         var transporter = nodemailer.createTransport({
//             service: 'gmail',
//             port: 465,
//             secure: true,
//             auth: {
//               user: 'harisahsolo@gmail.com',
//               pass: 'hotj bxpd eigb uvwm'
//             },
//             tls:{
//                 rejectUnauthorized: false
//             }
//           });
          
//           var mailOptions = {
//             from: 'harisahsolo@gmail.com',
//             to: email,
//             subject: 'Verify Your Email',
//             text: link
//           };
          
//           transporter.sendMail(mailOptions, function(error, info){
//             if (error) {
//               console.log(error);
//             } 
//           });
//           console.log("This is gonna print")
//           return res.status(201),res.json({message:"Email Sent ,successfully"});
//         }
//         catch(error){
//             console.log(error.message);
//         }
//     }
const sendemail = async (req, res) => {
    try {
      const email = req.email;
      const secret = process.env.JWT_SECRET + email;
      const user = await User.findOne({ email: email });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const token = jwt.sign({ email: email, id: user._id }, secret, { expiresIn: '5m' });
      const link = `${process.env.link}/${token}`;
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
          user: 'harisahsolo@gmail.com',
          pass: 'hotj bxpd eigb uvwm'
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
      const mailOptions = {
        from: 'harisahsolo@gmail.com',
        to: email,
        subject: 'Verify Your Email',
        text: link
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Error sending email" });
        }
        console.log("Email sent successfully");
        return res.status(201).json({ message: "Email sent successfully" });
      });
      
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };    

  const forgotpassword = async (req,res)=>{
    try {
      const  email  =  req.body.email;
      console.log("forgotpasswordbackend",email);
      const secret = process.env.FORGOT_PASSWORD + email;
      const user = await User.findOne({ email: email });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const token = jwt.sign({ email: email, id: user._id }, secret, { expiresIn: '5m' });
      const link = `${process.env.link}/resetpassword/${token}`;
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
          user: 'harisahsolo@gmail.com',
          pass: 'hotj bxpd eigb uvwm'
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
      const mailOptions = {
        from: 'harisahsolo@gmail.com',
        to: email,
        subject: 'Link to reset your password',
        text: link
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Error sending email" });
        }
        console.log("Email sent successfully");
        return res.status(201).json({ message: "Email sent successfully" });
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  const resetpassword = async (req, res) => {
    try {
      console.log(req.body);
      const { token, password } = req.body.formdata;
      const decode = jwtDecode(token);
      const email = decode.email;
  
      // Find the user by email
      const user = await User.findOne({ email: email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Update the user's password; hashing will be handled by the pre-save hook
      user.password = password;
      await user.save();
  
      // Respond with success message
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "An error occurred" });
    }
  };

module.exports = {
    signup,
    login,
    authenticate,
    checkemail ,
    accesstoken,
    sendemail,
    verifyemail,
    forgotpassword,
    resetpassword
};
