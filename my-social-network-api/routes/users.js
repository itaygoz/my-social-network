const fs = require('fs');
const uplaod = require('../middleware/upload');
const winston = require('winston');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const { User, validate } = require('../models/user');
const admin = require('../middleware/admin');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -friends -pendings');
    res.send(user);
});

router.get('/:id', auth, async (req, res) => {
    const user = await User.findById(req.params.id).select('firstName lastName');
    res.send(user);
});

router.post('/', uplaod.single('avatar'), async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['firstName', 'lastName', 'email', 'password']));
    user.password = await bcrypt.hash(user.password, 10);

    if (!req.file) {
        await user.save();
        const token = user.generateAuthToken();

        return res.header('x-auth-token', token)
            .header('access-control-expose-headers', 'x-auth-token')
            .send(_.pick(user, ['_id', 'name', 'email']));
    }

    fs.readFile(req.file.path, async (err, img) => {
        const encode_image = img.toString('base64');

        user.avatar = {
            contentType: req.file.mimetype,
            data: new Buffer.from(encode_image, 'base64')
        };
        //delete file after saving it in db
        fs.unlink(req.file.path, () => winston.info('File uploaded to db & deleted from storage succefully'));

        await user.save();
        const token = user.generateAuthToken();

        res.header('x-auth-token', token)
            .header('access-control-expose-headers', 'x-auth-token')
            .send(_.pick(user, ['_id', 'name', 'email']));
    });
});

router.delete('/:id', auth, admin, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
});

module.exports = router;