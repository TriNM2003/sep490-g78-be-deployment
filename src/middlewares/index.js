const adminhMiddleware = require("./admin.middleware");
const authMiddleware = require("./auth.middleware");
const shelterMiddleware = require("./shelter.middleware");

module.exports = {
    authMiddleware,
    adminhMiddleware,
    shelterMiddleware,
}