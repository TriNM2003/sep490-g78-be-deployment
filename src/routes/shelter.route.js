const express = require("express");
const shelterRouter = express.Router();
const bodyParser = require("body-parser");
const cloudinary = require("../configs/cloudinary");
const { verifyAccessToken, verifyGoogleCallback, verifyGoogleCallbackAdmin } = require("../middlewares/auth.middleware");
const { shelterController } = require("../controllers");

shelterRouter.use(bodyParser.json());
shelterRouter.get("/get-all", shelterController.getAll);



module.exports = shelterRouter;
