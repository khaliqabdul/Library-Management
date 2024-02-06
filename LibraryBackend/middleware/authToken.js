const mongoose = require('mongoose');
const User = mongoose.model("Registration");
const jwt = require("jsonwebtoken");
const { jwtKey } = require('../keys');


module.exports = (req, res, next) => {
    const { authorization } = req.headers
    // authorization === Bearer hhkjlhodyNWDMNKJYUPONBKJVC...
    if(!authorization){
        return res.status(401).send({error:"You must be logged in...dear"})
    }
    const token = authorization.replace("Bearer ","");
    jwt.verify(token, jwtKey, async (error, payload) => {
        if(error){
            return res.status(401).send({error:"You must be logged in.."})
        }
        // get userId which we have sent as payload jwt.sign({userId: register._Id}, jwtKey)
        const {userId} = payload
        // console.log(payload)
        const user = await User.findById(userId)
        req.user = user
        next();
    })
};