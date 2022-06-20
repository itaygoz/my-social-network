const fs = require('fs');
const uplaod = require('../middleware/upload');
const winston = require('winston');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('avatar');
    res.send(user.avatar);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('avatar');
    res.send(user.avatar);
});

router.post('/', auth, uplaod.single('avatar'), async (req, res) => {
    fs.readFile(req.file.path, async (err, img) => {

        const encode_image = img.toString('base64');

        const user = await User.findById(req.user._id).select('avatar');
        user.avatar = {
            contentType: req.file.mimetype,
            data: new Buffer.from(encode_image, 'base64')
        };

        user.save();

        //delete file after saving it in db
        fs.unlink(req.file.path, () => winston.info('File uploaded to db & deleted from storage succefully'));
        res.status(201).send(user.avatar);
    });
});

router.put('/', auth, uplaod.single('avatar'), async (req, res) => {
    fs.readFile(req.file.path, async (err, img) => {

        const encode_image = img.toString('base64');

        const user = await User.findById(req.user._id).select('avatar');
        user.avatar = {
            contentType: req.file.mimetype,
            data: new Buffer.from(encode_image, 'base64')
        };

        user.save();

        //delete file after saving it in db
        fs.unlink(req.file.path, () => winston.info('File uploaded to db & deleted from storage succefully'));
        res.status(201).send(user.avatar);
    });
});

router.delete('/', auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    delete user.avatar;

    user.save();
});

router.delete('/:id', auth, admin, async (req, res) => {
    const user = await User.findById(req.params._id);
    delete user.avatar;

    user.save();
});

module.exports = router;
