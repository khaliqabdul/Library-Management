const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const {jwtKey} = require('../keys');
const bcrypt = require('bcrypt');

const User = mongoose.model("Registration");

// Registration or signup
const signup = async (req, res) => {
    try {
        const {firstName, lastName, email, password, confirmPassword} = req.body;

        const user = new User({
            firstName, lastName, email, password, confirmPassword
        });

        const token = jwt.sign({userId: user._id}, jwtKey)
        await user.save()
        // get token
        res.send({token: token})
    } catch (error) {
        console.log(error.message)
        return res.status(422).send(error.message)
    }
};
// signin
const signin = async (req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(422).send({error: '1 Must provide email or password'});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(422).send({error: 'Must provide email or password'});
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(422).send({ error: 'Must provide email or password' });
            }
        
        const token = jwt.sign({userId: user._id}, jwtKey)
        res.send({token})
    } catch (error) {
        console.log(error.message)
        return res.send(error.message)
    }
}

module.exports = {
    signup,
    signin,
}