const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
    winston.add(new winston.transports.File({ filename: 'logfile.log' }))
        .add(new winston.transports.Console({
            format: winston.format.combine(
                // winston.format.colorize(),
                winston.format.prettyPrint()), handleExceptions: true, handleRejections: true
        }))
        .add(new winston.transports.MongoDB({ db: 'mongodb://localhost/my-social-network', options: { useUnifiedTopology: true } }))
        .exceptions.handle(new winston.transports.File({ filename: 'uncaughtException.log' }));

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
}