const express = require ("express");
const adoptionSubmissionRouter = express.Router();
const bodyParser = require("body-parser");
const { verifyAccessToken } = require("../middlewares/auth.middleware");


const { adoptionSubmissionController } = require("../controllers");

adoptionSubmissionRouter.use(bodyParser.json());

adoptionSubmissionRouter.get("/get-adoption-request-list",verifyAccessToken ,adoptionSubmissionController.getAdtoptionRequestList);

module.exports = adoptionSubmissionRouter;

