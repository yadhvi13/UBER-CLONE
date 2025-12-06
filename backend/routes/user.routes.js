const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");
const {body} = require("express-validator");

// validating user data
router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('First and Last name should be atleast 3 characters long'),
    body('password').isLength({min:5}).withMessage('Password should be atleast 5 characters long'),
],
userController.registerUser
)

// login route for user
router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password must be atleast 5 character long'),
],
userController.loginUser
)

module.exports = router;