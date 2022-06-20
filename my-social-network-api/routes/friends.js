const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { User } = require('../models/user');
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find().select('_id firstName lastName');

    res.send(users);
});

router.get('/me', auth, async (req, res) => {
    const users = await User.findById(req.user._id).select('friends');

    res.send(users.friends);
});



router.get('/pendings', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('pendings');
    if (!user) return res.status(404).send('User does not exist');

    res.send(user.pendings);
});
router.get('/requests', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('requests');
    if (!user) return res.status(404).send('User does not exist');

    res.send(user.requests);
});

router.get('/:id', auth, async (req, res) => {
    const user = await User.findById(req.params.id).select('friends');
    if (!user) return res.status(404).send('User does not exist');

    res.send(user.friends);
});

router.post('/request', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const me = await User.findById(req.user._id).select('_id firstName lastName requests');
    if (!me) return res.status(404).send('User does not exist');

    if (req.user._id == req.body.userId) return res.status(405).send('Cannot add yourself as a friend');

    const user = await User.findById(req.body.userId).select('_id firstName lastName pendings');
    if (!user) return res.status(404).send('User does not exist');

    let added = user.pendings.addToSet({
        _id: me._id,
        firstName: me.firstName,
        lastName: me.lastName
    });
    if (added.length == 0) return res.status(405).send('User is already requested');

    added = me.requests.addToSet({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName
    })

    me.save();
    user.save();
    res.send({ message: 'request sent succefully', user: req.body.userId });
});

router.post('/approve', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const me = await User.findById(req.user._id).select('firstName lastName friends pendings');
    if (!me) return res.status(404).send('User does not exist');

    const user = await User.findById(req.body.userId).select('_id firstName lastName friends requests');
    if (!user) return res.status(404).send('User does not exist');

    const friendReq = me.pendings.id(req.body.userId);
    if (!friendReq) return res.status(404).send('The request does not exist');

    me.pendings.pull(req.body.userId);
    user.requests.pull(req.user._id);

    me.friends.addToSet({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName
    });

    user.friends.addToSet({
        _id: req.user._id,
        firstName: me.firstName,
        lastName: me.lastName
    });

    me.save();
    user.save();

    res.send({ message: 'approved', user: req.body.userId });
});

router.delete('/pending/:id', auth, async (req, res) => {
    const me = await User.findById(req.user._id).select('pendings');
    if (!me) return res.status(404).send('User does not exist');

    const user = await User.findById(req.params.id).select('requests');
    if (!user) return res.status(404).send('User does not exist');

    const session = await mongoose.startSession();
    let appendToDelete;
    session.startTransaction();
    try {
        appendToDelete = me.pendings.id(req.params.id);
        if (!appendToDelete) return res.status(404).send('This friend not found');
        me.pendings.pull(req.params.id);
        user.requests.pull(req.user._id);

        user.save();
        me.save();
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }

    res.send(appendToDelete);
});

router.delete('/request/:id', auth, async (req, res) => {
    const me = await User.findById(req.user._id).select('requests');
    if (!me) return res.status(404).send('User does not exist');

    const user = await User.findById(req.params.id).select('pendings');
    if (!user) return res.status(404).send('User does not exist');

    const session = await mongoose.startSession();
    let appendToDelete;
    session.startTransaction();
    try {
        appendToDelete = me.requests.id(req.params.id);
        if (!appendToDelete) return res.status(404).send('This friend not found');
        me.requests.pull(req.params.id);
        user.pendings.pull(req.user._id)

        user.save();
        me.save();
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }

    res.send(appendToDelete);
});

router.delete('/:id', auth, async (req, res) => {
    const me = await User.findById(req.user._id).select('friends');
    if (!me) return res.status(404).send('User does not exist');

    const user = await User.findById(req.params.id).select('friends');
    if (!user) return res.status(404).send('User does not exist');

    const session = await mongoose.startSession();
    session.startTransaction();
    let appendToDelete;
    try {
        appendToDelete = me.friends.id(req.params.id);
        if (!appendToDelete) return res.status(404).send('This friend not found');
        me.friends.pull(req.params.id);
        user.friends.pull(req.user._id);

        me.save();
        user.save();
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }

    res.send(appendToDelete);
});

function validate(req) {
    const schema = Joi.object({
        userId: Joi.objectId().required()
    });
    return schema.validate(req);
}

module.exports = router;