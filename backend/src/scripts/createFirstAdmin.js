const mongoose = require("mongoose");
const config = require("../config/config");
const userService = require("../services/userService");
const connectDB = require("../config/database");
// const connectDB = require("../path/to/connectDB"); // Adjust the path to your connectDB file

async function createFirstAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("MongoDB connected.");

    // Create the first admin
    const adminData = {
      email: "benay74451@jomspar.com",
      name: "System Admin",
      temporaryPassword: "ChangeMe123!", // Should be changed on first login
    };

    console.log("Creating first admin...");
    const admin = await userService.createAdminUser(adminData);
    console.log("First admin created successfully:", admin);

    console.log("Disconnecting from MongoDB...");
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Failed to create first admin:", error);
    process.exit(1); // Exit with a failure code
  }
}

createFirstAdmin();