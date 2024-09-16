const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Defining Schema
const registrationSchema = new mongoose.Schema({
    reader_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reader'
    }],
    book_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true},
    email: {type: String, unique: true, required: true, trim: true},
    password: {type:String, required: true},
    confirmPassword: {type: String, required: true},
    avatar: String,
    tokens: [{type: Object}]
});

// this will execute before saving registrationSchema
// normal function will pass here, instead of aero function
// we retrieve user from this "const user = this;" (mean Registration.js file)
registrationSchema.pre("save", function(next){
    const user = this;
    // if user password is not modified then no need for hashing
    if(!user.isModified('password')){
        return next()
    }
    // salt is a random string
    bcrypt.genSalt(10, (err, salt) => {
        if(err){
            return next(err)
        }
        bcrypt.hash(user.password, salt, (err, hash)=>{
            if(err){
                return next(err)
            }
            user.password = hash
            next()
        })
    })
});

// compare password in signin form
registrationSchema.method.comparePassword = function(candidatePassword){
    const user = this;
    return new Promise((resolve, reject)=>{
        bcrypt.compare(candidatePassword, user.password, (err, isMatch)=>{
            if(err){
                return reject(err)
            }
            if(!isMatch){
                return reject(err)
            }
            resolve(true)
        })
    })
};

// Model
mongoose.model("Registration", registrationSchema);