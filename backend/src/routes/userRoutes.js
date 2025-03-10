const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Fetch users data (only accessible by users in the ADMIN group)
router.get('/', userController.getUsersData);

module.exports = router;