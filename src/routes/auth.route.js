

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller'); //import the authentication controller to handle signup and login logic

// POST /auth/signup
router.post('/signup', authController.signup);

// POST /auth/login
router.post('/login', authController.login);

module.exports = router;