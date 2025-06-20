

const passport = require("../configs/passport.config");
const redisClient = require("./redisClient");
const mailer = require('./mailer.config');
const cloudinary = require('./cloudinary');
module.exports = {
    passport,
    redisClient,
    mailer,
    cloudinary,
}