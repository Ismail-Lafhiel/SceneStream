const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const routes = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const userService = require("./services/userService");

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sync users from Cognito to MongoDB when the app starts
userService
  .syncUsersFromCognito()
  .then(() => {
    console.log("Users synced from Cognito to MongoDB.");
  })
  .catch((error) => {
    console.error("Failed to sync users from Cognito:", error);
  });

// API Routes
app.use("/api", routes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
