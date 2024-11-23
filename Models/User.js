// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    MosqueId:{
        type:String,
        required:true,
        unique:true,
    },
    masjidname: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    country:{
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    latitude:{
        type:String,
        required: true, 
    },
    longitude:{
        type:String,
        required: true,
    },
    postalcode:{
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },
    isverified: {
        type: Boolean,
    }
});

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare passwords
UserSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
