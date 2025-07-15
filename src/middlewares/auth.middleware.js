const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const passport = require("passport");

const verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return next(createError.Unauthorized);
  }
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  if (!token) {
    throw createError.NotFound("Token is not provided!");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name == "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload;
    req.user = next();
  });
};

const optionalVerifyAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.payload = decoded;
      }
    });
  }
  next();
};

const verifyGoogleCallback = passport.authenticate("google-user", {
  failureRedirect: "http://localhost:3000/error",
});
const verifyGoogleCallbackAdmin = passport.authenticate("google-admin", {
  failureRedirect: "http://localhost:3000/error",
});

const authMiddleware = {
  verifyAccessToken,
  optionalVerifyAccessToken,
  verifyGoogleCallback,
  verifyGoogleCallbackAdmin,
};

module.exports = authMiddleware;
