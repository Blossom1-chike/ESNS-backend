require("dotenv").config();
const jwt = require('jsonwebtoken');
const { EsimProfilePage } = require("twilio/lib/rest/supersim/v1/esimProfile");
const {JWT_SECRET_KEY} = process.env;

/**Verify token method which checks that a user is logged in */
const verifyToken = async(req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization || req.cookies.authToken;

    if(!token){
        return res.status(400).json({error: "Cannot access this route because a token is needed for authorization"})
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
      
        req.user = decoded;
    } catch (error) {
        console.log('Invalid token', err);
    }
    return next();
}

/**Assigns the verifytoken method to authorize so that autorize is called instead */
const authorize = verifyToken;


/**Admin middleware to verify that a user is logged in and is an admin not a regular user*/
const isAdmin = (req, res, next) => {
    const token = req.body.token || req.headers['x-access-token'] || req.headers.authorization || req.cookies.authToken;
    if(!token){
        return res.status(400).json({error: "Cannot access this route because a token is needed for authorization"})
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
       
        req.user = decoded;

        if(req.user.role !== "Admin"){
            return res.status(401).json({error: "Cannot access this route, not an Admin"});
        }else{
            return next();
        }
    } catch (error) {
        console.log('Invalid token', err);
    }
}

/**User middleware to verify that a user is logged in and is a regular user not an admin */

const isUserNotAdmin = (req, res, next) => {
    const token = req.body.token || req.headers['x-access-token'] || req.headers.authorization || req.cookies.authToken;
    if(!token){
        return res.status(400).json({error: "Cannot access this route because a token is needed for authorization"})
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
       
        req.user = decoded;

        if(req.user.role !== "User"){
            return res.status(401).json({error: "Cannot access this route, not a regular User"});
        }else{
            return next();
        }
    } catch (error) {
        console.log('Invalid token', err);
    }
}

module.exports = {
    isUserNotAdmin,
    isAdmin,
    verifyToken
}