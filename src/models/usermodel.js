const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    title: {
        type: String,
        require: true,
        enum: ["Mr", "Mrs", "Miss"],
        //match: [/"Mr"|"Mrs"|"Miss"/]
    },
    name: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true,
        unique: true,
        match: [/^(\+\d{1,3}[- ]?)?\d{10}$/]
    },
    email: {
        type: String,
        require: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]//abc@gmail.com
    },
    password: {
        type: String,
        require: true,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/]//Minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character
    },
    address: {
        street: {type: String },
        city: {type: String },
        pincode: {type: String }
    },

}, { timestamps: true })

module.exports = mongoose.model('Book', userSchema)