const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const minifyUserSchema = require('./minifyUserSchema');

const Post = mongoose.model('Post', new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minlength: 2,
        maxLength: 2000
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    lastUpdated: Date,
    user: minifyUserSchema,
    likes: {
        type: [new mongoose.Schema({
            user: {
                type: minifyUserSchema
            }
        })]
    },
    likesCount: {
        type: Number,
        default: 0
    },
    comments: {
        type: [new mongoose.Schema({
            user: minifyUserSchema,
            content: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 2000
            },
            date: {
                type: Date,
                required: true,
                default: Date.now
            }
        })]
    },
    images: {
        type: [new mongoose.Schema({
            name: {
                type: String
            },
            data: Buffer,
            contentType: String
        })]
    },
    isPrivate: {
        type: Boolean,
        default: false
    }
}));

function validatePost(post) {
    const schema = Joi.object({
        content: Joi.string().min(2).max(2000).required(),
        isPrivate: Joi.boolean()
    });

    return schema.validate(post);
}

exports.Post = Post;
exports.validate = validatePost;