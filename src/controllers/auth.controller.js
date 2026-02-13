//handle user authentication (signup and login)

const User = require('../models/user.model'); //import the user model to interact with the database
const bcrypt = require('bcrypt'); //import bcrypt for password hashing
const jwt = require('jsonwebtoken'); //import jsonwebtoken for token generation

const JWT_SECRET = process.env.JWT_SECRET || 'yarncom_secret_key'; //secret key for signing JWTs, should be stored in environment variables

//signup controller to handle user registration
exports.signup = async(req, res)=>
{
    try{
        const {first_name, last_name, email, password} = req.body; //destructure the request body to get user details

        //check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser)
        {
            return res.status(400).json({message: 'User already exists with this email'}); //return error if user already exists
        }
        
        //hash the password before saving to database
        const hashedPassword = await bcrypt.hash(password, 12); //hash the password with a salt round of 10

        //create a new user instance with the provided details and hashed password
        const newUser =  await User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword
        });
        res.status(201).json({message: "Welcome to Yarncom! Your account has been created successfully.",userId: newUser._id }); //return success response with user ID
    }catch(err) 
    {
        res.status(500).json({error: err.message}); //return error response if something goes wrong
    };
};

    exports.login = async (req,res) =>
        {
            try{
                const {email, password} = req.body //destructure the request body to get email and password

                //check if user exists
                const user = await User.findOne({email});
                if(!user)
                {
                    return res.status(401).json({message: 'Invalid email or password'}); //return error if user does not exist
                }

                const isPasswordValid = await bcrypt.compare(password, user.password); //compare the provided password with the hashed password in the database
                if(!isPasswordValid)
                {
                    return res.status(401).json({message: 'Invalid email or password'}); //return error if password is invalid
                }

                //generate JWT token(1 hour expiry)
                const token = jwt.sign({id: user._id, email: user.email}, JWT_SECRET, {expiresIn: '1h'}); //sign a JWT with the user ID and secret key, set to expire in 1 hour
            
                res.json({message : 'Login successful', token , user : {
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                }}); //return success response with the generated token and user details
            }
            catch(err)
            {
                res.status(500).json({error: err.message}); //return error response if something goes wrong
            }
        };
