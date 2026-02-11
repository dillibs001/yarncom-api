//defines the user model and schema for the database
const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    first_name : {type: String, required:[true, 'First name is required'], trim:true},
        last_name: {type: String, required:[true, 'Last name is required'],trim:true},
            email: {type: String, required:[true, 'Email is required'], unique:true, trim:true},
                password: {type: String, required:[true, 'Password is required'], minlength:[6, 'Password must be at least 6 characters long']}

}, {timestamps: true})//define the user schema with fields and validation rules, also add timestamps for createdAt and updatedAt

const User = mongoose.model('User', userSchema);//create the user model from the schema

module.exports = User;//export the user model for use in other parts of the application