const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const routes = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const cron = require("node-cron");
const userService = require("./services/userService");

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cron.schedule("0 * * * *", async () => {
  console.log("Running scheduled Cognito user sync");
  try {
    const results = await userService.syncCognitoUsers();
    console.log("Sync completed:", results);
  } catch (error) {
    console.error("Scheduled sync failed:", error);
  }
});

// API Routes
app.use("/api", routes);

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;
