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

module.exports.loginUser = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email,password} = req.body;

    // email enter jo kri hai , isme koi user exist krta h ya nhi
    const user = await userModel.findOne({email}).select('+password');
    // +password using here kyuki phle jaha (user.model.js) password me humne select false kra tha,toh yha ye password leke aayega.

    if(!user){
        return res.status(401).json({message: 'Invalid email or password'});
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message: 'Invalid Password'});
    }

    const token = user.generateAuthToken();

    res.status(200).json({token,user});
}