const express = require("express");
const adoptionFormRouter = express.Router({ mergeParams: true });
const bodyParser = require("body-parser");
const cloudinary = require("../configs/cloudinary");
const { verifyAccessToken, verifyGoogleCallback, verifyGoogleCallbackAdmin } = require("../middlewares/auth.middleware");
const adoptionFormController = require("../controllers/adoptionForm.controller");


adoptionFormRouter.use(bodyParser.json());

adoptionFormRouter.get("/get-by-shelter",[verifyAccessToken], adoptionFormController.getFormsByShelter);
adoptionFormRouter.post("/create/:petId",[verifyAccessToken], adoptionFormController.createForm);
adoptionFormRouter.post("/create-by-template/:petId",[verifyAccessToken], adoptionFormController.createFormByTemplate);
adoptionFormRouter.put("/:formId/edit",[verifyAccessToken], adoptionFormController.editForm);
adoptionFormRouter.put("/:formId/update-questions",[verifyAccessToken], adoptionFormController.editFormQuestions);
adoptionFormRouter.delete("/:formId/delete",[verifyAccessToken], adoptionFormController.deleteForm);




module.exports = adoptionFormRouter;
