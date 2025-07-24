const express = require("express");
const returnRequestRouter = express.Router({ mergeParams: true });
const returnRequestController = require("../controllers/returnRequest.controller");
const {verifyAccessToken} = require("../middlewares/auth.middleware");
const {isShelterMember} = require("../middlewares/shelter.middleware");
const cloudinary = require("../configs/cloudinary");


returnRequestRouter.post("/create", cloudinary.upload.array("photos", 5), verifyAccessToken, returnRequestController.createReturnRequest);

returnRequestRouter.put("/:requestId/update", cloudinary.upload.array("photos", 5), verifyAccessToken, returnRequestController.updateReturnRequest);

//returnRequestRouter.get("/get-all", verifyAccessToken, returnRequestController.getReturnRequests);

returnRequestRouter.get("/get-by-user", verifyAccessToken, returnRequestController.getReturnRequestsByUser);

returnRequestRouter.get("/get-by-shelter", [verifyAccessToken, isShelterMember], returnRequestController.getReturnRequestsByShelter);

returnRequestRouter.delete("/:requestId/delete", verifyAccessToken, returnRequestController.deleteReturnRequest);

returnRequestRouter.put("/:requestId/approve", [verifyAccessToken, isShelterMember], returnRequestController.approveReturnRequest);

returnRequestRouter.put("/:requestId/reject", [verifyAccessToken, isShelterMember], returnRequestController.rejectReturnRequest);

module.exports = returnRequestRouter;
