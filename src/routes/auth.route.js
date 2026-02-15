

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller'); //import the authentication controller to handle signup and login logic


router.get('/login', authController.renderLoginPage);//render the login page when a GET request is made to /auth/login
router.get('/signup', authController.renderSignupPage);//render the signup page when a GET request is made to /auth/signup
router.get('/logout', authController.logout);//handle user logout when a GET request is made to /auth/logout

// POST /auth/signup
router.post('/signup', authController.signup);

// POST /auth/login
router.post('/login', authController.login);

module.exports = router;