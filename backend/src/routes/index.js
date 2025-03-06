const express = require("express");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.use("/admin", userRoutes);

module.exports = router;