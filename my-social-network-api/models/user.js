const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('@hapi/joi');
const passwordComplexity = require('joi-password-complexity');
const mongoose = require('mongoose');
const minfyUserSchema = require('./minifyUserSchema');
const minifyUserSchema = require('./minifyUserSchema');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean,
    avatar: {
        data: Buffer,
        contentType: String
    },
    friends: [minifyUserSchema],
    pendings: [minifyUserSchema],
    requests: [minifyUserSchema]
});
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, firstName: this.firstName, lastName: this.lastName, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().required()//.passwordComplexity()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;