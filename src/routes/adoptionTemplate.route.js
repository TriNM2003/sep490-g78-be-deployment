const express = require("express");
const adoptionTemplateRouter = express.Router({ mergeParams: true });
const bodyParser = require("body-parser");
const cloudinary = require("../configs/cloudinary");
const { verifyAccessToken, verifyGoogleCallback, verifyGoogleCallbackAdmin } = require("../middlewares/auth.middleware");
const adoptionTemplateController = require("../controllers/adoptionTemplate.controller");


adoptionTemplateRouter.use(bodyParser.json());
adoptionTemplateRouter.get("/get-all",[verifyAccessToken], adoptionTemplateController.getAll);
adoptionTemplateRouter.post("/create",[verifyAccessToken], adoptionTemplateController.create);
adoptionTemplateRouter.put("/:templateId/edit",[verifyAccessToken], adoptionTemplateController.editTemplate);
adoptionTemplateRouter.post("/:templateId/duplicateTemplate",[verifyAccessToken], adoptionTemplateController.duplicateTemplate);
adoptionTemplateRouter.put("/:templateId/update-questions",[verifyAccessToken], adoptionTemplateController.editTemplateQuestions);
adoptionTemplateRouter.delete("/:templateId/delete",[verifyAccessToken], adoptionTemplateController.deleteTemplate);



module.exports = adoptionTemplateRouter;
