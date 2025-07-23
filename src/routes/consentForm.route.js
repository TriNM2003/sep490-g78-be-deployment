const express = require("express");
const consentFormRouter = express.Router({ mergeParams: true });
const bodyParser = require("body-parser");
const { authMiddleware, shelterMiddleware } = require("../middlewares");
const { consentFormController } = require("../controllers");

consentFormRouter.use(bodyParser.json());

consentFormRouter.get(
  "/get-by-shelter/:shelterId",
  [authMiddleware.verifyAccessToken, shelterMiddleware.isShelterMember],
  consentFormController.getByShelter
);

consentFormRouter.get(
  "/get-by-user",
  [authMiddleware.verifyAccessToken, shelterMiddleware.isShelterMember],
  consentFormController.getByUser
);

consentFormRouter.post(
  "/create-form/:shelterId",
  [authMiddleware.verifyAccessToken, shelterMiddleware.isShelterMember],
  consentFormController.createForm
);

consentFormRouter.put(
  "/:consentFormId/edit",
  [authMiddleware.verifyAccessToken, shelterMiddleware.isShelterMember],
  consentFormController.editForm
);

consentFormRouter.put(
  "/:consentFormId/change-status",
  [authMiddleware.verifyAccessToken, shelterMiddleware.isShelterMember],
  consentFormController.changeFormStatus
);

consentFormRouter.delete(
  "/:consentFormId/delete",
  [authMiddleware.verifyAccessToken, shelterMiddleware.isShelterMember],
  consentFormController.deleteForm
);

module.exports = consentFormRouter;
