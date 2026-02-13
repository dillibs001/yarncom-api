const jwt = require('jsonwebtoken');

// We use the secret from your .env file to verify the "stamp" on the token
const JWT_SECRET = process.env.JWT_SECRET || 'yarncom_secret_key';

const verifyToken = (req, res, next) => {
    // 1. Grab the 'Authorization' header from the request
    const authHeader = req.headers.authorization;
    
    // 2. Check if the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            message: "No keycard provided. Access denied." 
        });
    }

    // 3. Extract the actual token (remove the "Bearer " part)
    const token = authHeader.split(' ')[1];

    // 4. Verify the token using our secret
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ 
                message: "Keycard is invalid or has expired." 
            });
        }
        
        // 5. Success! Attach the user's ID to the request object
        // This is like pinning an ID badge to the user's shirt.
        req.user = decoded;
        
        // 6. Move to the next "station" (the Controller)
        next();
    });
};

module.exports = verifyToken;//export the middleware function to be used in routes that require authentication