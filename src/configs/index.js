
const passport = require("../configs/passport.config");
const redisClient = require("./redisClient");
const mailer = require('./mailer.config');

module.exports = {
    passport,
    redisClient,
    mailer,
}