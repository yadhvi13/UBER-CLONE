const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be atleast 3 characters or more'],
        },
        lastname: {
            type: String,
            // required:true,
            minlength: [3, 'Last name must be atleast 3 characters or more'],
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be atleast 5 characters or more'],
    },
    password:{
        type:String,
        required:true,
        select: false,
        //if user ko select krte hai toh password feel nhi jayega!!!
    },
    //for live tracking using socket-id
    socketId:{
        type:String,
    },
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET)
    return token;
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hashSync(password,10);
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;