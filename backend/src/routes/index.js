const express = require("express");
const userRoutes = require("./userRoutes");
// const bookmarkRoutes = require("./bookmarkRoutes");

const router = express.Router();

router.use("/users", userRoutes);
// router.use("/bookmarks", bookmarkRoutes);

module.exports = router;