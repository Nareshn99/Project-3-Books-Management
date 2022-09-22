const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      enum: ["Mr", "Mrs", "Miss"],
      trim: true,
      //match: [/"Mr"|"Mrs"|"Miss"/]
    },
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim:true
      
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      
    },
    password: {
      type: String,
      required: true,
      trim:true
    },

    address: {
      street: { type: String, trim: true, lowercase: true },
      city: { type: String, trim: true, lowercase: true },
      pincode: { type: String, trim: true, lowercase: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
