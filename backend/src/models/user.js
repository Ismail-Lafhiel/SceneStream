// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  cognitoId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;