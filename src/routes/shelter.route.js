const express = require("express");
const shelterRouter = express.Router();
const bodyParser = require("body-parser");
const shelterController = require("../controllers/shelter.controller");
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/admin.middleware");
const cloudinary = require("../configs/cloudinary");
const {
  isShelterManager,
} = require("../middlewares/shelterManager.middleware");

shelterRouter.use(bodyParser.json());

// USER
shelterRouter.post(
  "/send-shelter-request",
  verifyAccessToken,
  cloudinary.upload.fields([{ name: "shelterLicense", maxCount: 1 }]),
  shelterController.sendShelterEstablishmentRequest
);
shelterRouter.put(
  "/cancel-shelter-request/:requestId",
  verifyAccessToken,
  shelterController.cancelShelterEstabilshmentRequest
);
shelterRouter.get(
  "/get-shelter-request",
  verifyAccessToken,
  shelterController.getShelterRequestByUserId
);
shelterRouter.get(
  "/get-profile/:shelterId",
  [verifyAccessToken, isShelterManager],
  shelterController.getShelterProfile
);
shelterRouter.put(
  "/edit-profile/:shelterId",
  [verifyAccessToken, isShelterManager],
  cloudinary.upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  shelterController.editShelterProfile
);
shelterRouter.get(
  "/dashboard-statistics/:shelterId",
  [verifyAccessToken, isShelterManager],
  shelterController.getShelterDashboardStatistics
);
shelterRouter.get("/get-all", shelterController.getAll);
shelterRouter.get("/get-members/:shelterId", 
  [verifyAccessToken, isShelterManager],
   shelterController.getShelterMembers);
  shelterRouter.get("/find-eligible-users/:shelterId", 
  [verifyAccessToken, isShelterManager],
   shelterController.findEligibleUsersToInvite);
shelterRouter.post("/invite-members/:shelterId", [verifyAccessToken, isShelterManager], shelterController.inviteShelterMembers);
shelterRouter.get("/get-shelter-invitations-and-requests/:shelterId", 
  [verifyAccessToken, isShelterManager], 
  shelterController.getShelterInvitationsAndRequests);
shelterRouter.get("/get-user-invitations-and-requests", verifyAccessToken, shelterController.getUserInvitationsAndRequests);
shelterRouter.put("/review-shelter-invitation", verifyAccessToken, shelterController.reviewShelterInvitationRequest);
shelterRouter.put("/:shelterId/kick-member", [verifyAccessToken, isShelterManager], shelterController.kickShelterMember);
shelterRouter.put("/send-staff-request/:shelterEmail", verifyAccessToken, shelterController.requestIntoShelter);
shelterRouter.get("/eligible-shelters", verifyAccessToken, shelterController.getEligibleShelters);
shelterRouter.put("/:shelterId/review-user-request", [verifyAccessToken, isShelterManager], shelterController.reviewShelterRequest);

// ADMIN
shelterRouter.get(
  "/admin/get-shelters-list",
  [verifyAccessToken, isAdmin],
  shelterController.getAllShelter
);
shelterRouter.get(
  "/admin/get-shelter-requests-list",
  [verifyAccessToken, isAdmin],
  shelterController.getAllShelterEstablishmentRequests
);
shelterRouter.get(
  "/admin/get-overview-statistics",
  [verifyAccessToken, isAdmin],
  shelterController.getOverviewStatistic
);
shelterRouter.post(
  "/admin/review-shelter-request",
  [verifyAccessToken, isAdmin],
  shelterController.reviewShelterEstablishmentRequest
);

module.exports = shelterRouter;
