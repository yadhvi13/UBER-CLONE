// requiring user model 
const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator');

module.exports.registerUser = async(req,res,next)=>{

    //if user routes me jo register hai usme validation check krte time koi issue aata hai toh wo error req me show ho jayegi!!
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    // CREATING DOCS for generating routes using co-pilot

    const {fullname,email,password} = req.body;

    // password database me kbhi bhi plain text me save nhi hota, we use hash
    const hashedPassword = await userModel.hashPassword(password);

    // create user 
    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });

    // generate token from user created above
    const token = user.generateAuthToken();
    res.status(201).json({token,user});
}