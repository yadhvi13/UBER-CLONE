const userModel = require('../models/user.model');


module.exports.createUser = async({
    // to create user we need three things mainly
    firstname,lastname,email,password
}) =>{
    if(!firstname||!email||!password){
        throw new Error('All field are required');
    }
    const user = userModel.create({
        fullname:{
            firstname,
            lastname,
        },
        email,
        password
    })

    return user;
}