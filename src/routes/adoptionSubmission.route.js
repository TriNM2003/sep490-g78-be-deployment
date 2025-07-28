const express = require ("express");
const adoptionSubmissionRouter = express.Router();
const bodyParser = require("body-parser");
const { verifyAccessToken } = require("../middlewares/auth.middleware");


const { adoptionSubmissionController } = require("../controllers");
const shelterMiddleware = require("../middlewares/shelter.middleware");

adoptionSubmissionRouter.use(bodyParser.json());

adoptionSubmissionRouter.get("/get-adoption-request-list",verifyAccessToken ,adoptionSubmissionController.getAdtoptionRequestList);
adoptionSubmissionRouter.post("/by-pet-ids", verifyAccessToken, adoptionSubmissionController.getSubmissionsByPetIds);
adoptionSubmissionRouter.post("/create-adoption-submission",verifyAccessToken ,adoptionSubmissionController.createAdoptionSubmission);
adoptionSubmissionRouter.post("/check-user-submitted",verifyAccessToken ,adoptionSubmissionController.checkUserSubmitted);
adoptionSubmissionRouter.patch("/update-submission-status/:shelterId", [verifyAccessToken, shelterMiddleware.isShelterMember], adoptionSubmissionController.updateSubmissionStatus);
adoptionSubmissionRouter.post("/schedule-interview/:shelterId", [verifyAccessToken, shelterMiddleware.isShelterManager], adoptionSubmissionController.createInterviewSchedule);
adoptionSubmissionRouter.get("/staff-schedule-count/:shelterId", [verifyAccessToken, shelterMiddleware.isShelterManager], adoptionSubmissionController.getInterviewCounts);
adoptionSubmissionRouter.get("/:submissionId", verifyAccessToken, adoptionSubmissionController.getAdoptionSubmissionById);




module.exports = adoptionSubmissionRouter;

