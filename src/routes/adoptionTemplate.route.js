const express = require("express");
const adoptionTemplateRouter = express.Router({ mergeParams: true });
const bodyParser = require("body-parser");
const cloudinary = require("../configs/cloudinary");
const { verifyAccessToken, verifyGoogleCallback, verifyGoogleCallbackAdmin } = require("../middlewares/auth.middleware");
const adoptionTemplateController = require("../controllers/adoptionTemplate.controller");


adoptionTemplateRouter.use(bodyParser.json());
adoptionTemplateRouter.get("/get-all",[verifyAccessToken], adoptionTemplateController.getAll);



module.exports = adoptionTemplateRouter;
