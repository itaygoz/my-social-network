const express = require('express');
const error = require('../middleware/error');
const users = require('../routes/users');
const avatar = require('../routes/avatar');
const auth = require('../routes/auth');
const posts = require('../routes/posts');
const likes = require('../routes/likes');
const friends = require('../routes/friends');
const cors = require('cors');

module.exports = function (app) {
    app.use(cors());
    app.use(express.json());
    app.use('/api/posts', posts);
    app.use('/api/likes', likes);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/users/avatar', avatar);
    app.use('/api/friends', friends);
    app.use(error);
}