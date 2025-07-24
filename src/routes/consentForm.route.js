const express = require("express");
const consentFormRouter = express.Router({ mergeParams: true });
const bodyParser = require("body-parser");
const { authMiddleware, shelterMiddleware } = require("../middlewares");
const { consentFormController } = require("../controllers");
const { cloudinary } = require("../configs");

consentFormRouter.use(bodyParser.json());

consentFormRouter.get(
  "/get-by-shelter/:shelterId",
  [
    authMiddleware.verifyAccessToken,
    authMiddleware.isActive,
    shelterMiddleware.isShelterMember,
  ],
  consentFormController.getByShelter
);

consentFormRouter.get(
  "/get-by-user",
  [authMiddleware.verifyAccessToken, authMiddleware.isActive],
  consentFormController.getByUser
);

consentFormRouter.post(
  "/create-form/:shelterId",
  [
    authMiddleware.verifyAccessToken,
    authMiddleware.isActive,
    shelterMiddleware.isShelterMember,
    cloudinary.upload.array("attachments", 2),
    (err, req, res, next) => {
      if (err?.code === "LIMIT_UNEXPECTED_FILE") {
        return res
          .status(400)
          .json({ message: "Tối đa 2 ảnh được phép đăng." });
      }
      next();
    },
  ],
  consentFormController.createForm
);

consentFormRouter.put(
  "/:consentFormId/edit",
  [
    authMiddleware.verifyAccessToken,
    authMiddleware.isActive,
    shelterMiddleware.isShelterMember,
    ,
    cloudinary.upload.array("attachments", 2),
    (err, req, res, next) => {
      if (err?.code === "LIMIT_UNEXPECTED_FILE") {
        return res
          .status(400)
          .json({ message: "Tối đa 2 ảnh được phép đăng." });
      }
      next();
    },
  ],
  consentFormController.editForm
);

consentFormRouter.put(
  "/:consentFormId/change-status-shelter/:shelterId",
  [
    authMiddleware.verifyAccessToken,
    authMiddleware.isActive,
    shelterMiddleware.isShelterMember,
  ],
  consentFormController.changeFormStatusShelter
);

consentFormRouter.delete(
  "/:consentFormId/delete",
  [
    authMiddleware.verifyAccessToken,
    authMiddleware.isActive,
    shelterMiddleware.isShelterMember,
  ],
  consentFormController.deleteForm
);

module.exports = consentFormRouter;
