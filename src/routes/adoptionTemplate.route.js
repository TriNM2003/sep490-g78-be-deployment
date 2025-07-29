const express = require("express");
const adoptionTemplateRouter = express.Router({ mergeParams: true });
const bodyParser = require("body-parser");
const cloudinary = require("../configs/cloudinary");
const {
  verifyAccessToken,
  verifyGoogleCallback,
  verifyGoogleCallbackAdmin,
} = require("../middlewares/auth.middleware");
const adoptionTemplateController = require("../controllers/adoptionTemplate.controller");
const shelterMiddleware = require("../middlewares/shelter.middleware");

adoptionTemplateRouter.use(bodyParser.json());
adoptionTemplateRouter.get(
  "/get-all",
  [verifyAccessToken],
  adoptionTemplateController.getAll
);
adoptionTemplateRouter.post(
  "/create",
  [verifyAccessToken, shelterMiddleware.isShelterStaff],
  adoptionTemplateController.create
);
adoptionTemplateRouter.put(
  "/:templateId/edit",
  [verifyAccessToken, shelterMiddleware.isShelterStaff],
  adoptionTemplateController.editTemplate
);
adoptionTemplateRouter.post(
  "/:templateId/duplicateTemplate",
  [verifyAccessToken, shelterMiddleware.isShelterStaff],
  adoptionTemplateController.duplicateTemplate
);
adoptionTemplateRouter.put(
  "/:templateId/update-questions",
  [verifyAccessToken, shelterMiddleware.isShelterStaff],
  adoptionTemplateController.editTemplateQuestions
);
adoptionTemplateRouter.delete(
  "/:templateId/delete",
  [verifyAccessToken, shelterMiddleware.isShelterStaff],
  adoptionTemplateController.deleteTemplate
);

module.exports = adoptionTemplateRouter;
