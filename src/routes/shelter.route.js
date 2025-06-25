const express = require("express");
const shelterRouter = express.Router();
const bodyParser = require("body-parser");
const shelterController = require("../controllers/shelter.controller");
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/admin.middleware");
const cloudinary = require("../configs/cloudinary");

shelterRouter.use(bodyParser.json());

// USER
shelterRouter.post("/send-shelter-request",
    // verifyAccessToken, 
    cloudinary.upload.fields([{ name: "shelterLicense", maxCount: 1 }]), 
    shelterController.sendShelterEstablishmentRequest)



// ADMIN
shelterRouter.get("/admin/get-shelters-list", [verifyAccessToken, isAdmin], shelterController.getAllShelter);
shelterRouter.get("/admin/get-shelter-requests-list", [verifyAccessToken, isAdmin], shelterController.getAllShelterEstablishmentRequests);
shelterRouter.get("/admin/get-overview-statistics", [verifyAccessToken, isAdmin], shelterController.getOverviewStatistic);


module.exports = shelterRouter;
