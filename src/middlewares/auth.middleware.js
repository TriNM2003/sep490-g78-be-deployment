const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const passport = require("passport");

const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) {
        return next(createError.Unauthorized)
    }
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1];

    if (!token) {
        throw createError.NotFound("Token is not provided!")
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return next(createError.Unauthorized(message))
        }
        req.payload = payload;
        next();
    })
};

const verifyGoogleCallback = passport.authenticate("google", { failureRedirect: "http://localhost:5173/error" });

const authMiddleware = {
    verifyAccessToken,
    verifyGoogleCallback,
}

module.exports = authMiddleware;