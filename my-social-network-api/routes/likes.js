const Joi = require('@hapi/joi');
const _ = require('lodash');
const express = require('express');
const { Post } = require('../models/post');
const { User } = require('../models/user');
const winston = require('winston/lib/winston/config');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('The post with the given ID was not found');
    res.send({ likes: post.likes, likesCount: post.likesCount });
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('There is no user with the give id.');

    let post = await Post.findById(req.body.postId);
    if (!post) return res.status(404).send('The post with the given ID was not found');

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // The like id is the same as the user id
        const addedLike = post.likes.addToSet({
            _id: user._id,
            'user.firstName': user.firstName,
            'user.lastName': user.lastName
        });

        if (addedLike.length == 0) {
            post.likes.id(user._id).remove();
            post.likesCount--;
        } else post.likesCount++;

        post.save();
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }

    res.send({ likes: post.likes, likesCount: post.likesCount });
});

function validate(req) {
    const schema = Joi.object({
        postId: Joi.objectId().required()
    });
    return schema.validate(req);
}

module.exports = router;

