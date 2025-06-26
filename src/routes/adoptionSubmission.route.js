const express = require ("express");
const adoptionSubmissionRouter = express.Router();
const bodyParser = require("body-parser");

const { adoptionSubmissionController } = require("../controllers");

adoptionSubmissionRouter.use(bodyParser.json());

adoptionSubmissionRouter.get("/get-adoption-request-list/:userId", adoptionSubmissionController.getAdtoptionRequestList);

module.exports = adoptionSubmissionRouter;

