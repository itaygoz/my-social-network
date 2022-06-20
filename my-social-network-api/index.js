const winston = require('winston');
const express = require('express');
const app = express();

require('./stratup/cors')(app);
require('./stratup/logging')();
require('./stratup/config')();
require('./stratup/routes')(app);
require('./stratup/db')();
require('./stratup/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
