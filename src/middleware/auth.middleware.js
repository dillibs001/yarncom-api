const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); //import the user model to interact with the database

// We use the secret from your .env file to verify the "stamp" on the token
const JWT_SECRET = process.env.JWT_SECRET || 'yarncom_secret_key';

exports.protect = async (req, res, next) => { 

    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        {
            token = req.headers.authorization.split(' ')[1]; //extract the token from the "Bearer " prefix
        }
        else if(req.cookies?.token)
            {
                token = req.cookies.token; //extract the token from cookies if it exists
            }
            if(!token)
            {
                if(req.headers.accept?.includes('text/html'))//if the request is from a browser, redirect to login page
                {
                    return res.redirect('/auth/login'); //redirect to login page if no token is provided and the request is from a browser
                }
                return res.status(401).json({message: 'Access denied.'}); //return error if no token is provided
            }
            const decoded = jwt.verify(token, JWT_SECRET); //verify the token using the secret key
            req.user = await User.findById(decoded.id).select('-password'); //attach the user details to the request object, excluding the password
            
            res.locals.user = req.user; //make user details available in response locals for views
            next(); //move to the next middleware or controller
    }
    catch(err)
    {
        res.clearCookie('token'); //clear the token cookie if verification fails
        if(req.headers.accept?.includes('text/html')) return res.redirect('/auth/login'); //redirect to login page if token verification fails and the request is from a browser
        res.status(401).json({message: 'Invalid or expired session.'}); //return error if token is invalid or expired
    }

};

exports.getUserIfLoggedIn = async (req, res, next) =>   
{
    const token = req.cookies?.token; //check for token in cookies
    if(token)
    {
        try{
            const decoded = jwt.verify(token, JWT_SECRET); //verify the token using the secret key
            user = await User.findById(decoded.id).select('-password'); //attach the user details to the request object, excluding the password
            if(user)
            {
                req.user = user; //
                res.locals.user = user;


            }
        }catch(err)
            {
                // If token verification fails, we simply proceed without attaching user details
                res.clearCookie('token'); //clear the token cookie if verification fails
            }

    }
    next(); //move to the next middleware or controller regardless of whether the user is authenticated or not


};





