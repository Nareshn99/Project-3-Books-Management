const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      enum: ["Mr", "Mrs", "Miss"],
      trim: true,
      //match: [/"Mr"|"Mrs"|"Miss"/]
    },
    name: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      require: true,
      unique: true,
      match: [/^(\+\d{1,3}[- ]?)?\d{10}$/],
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/], //abc@gmail.com
    },
    password: {
      type: String,
      require: true,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
      ], //Minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character
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
