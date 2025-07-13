const express = require("express");
const reportRouter = express.Router();
const bodyParser = require("body-parser");
const {verifyAccessToken} = require("../middlewares/auth.middleware")
const {isAdmin} = require("../middlewares/admin.middleware");
const reportController = require("../controllers/report.controller");
const { cloudinary } = require("../configs");

reportRouter.use(bodyParser.json());

//USER
reportRouter.post("/report-user", 
    verifyAccessToken,
    cloudinary.upload.fields([
    { name: "photos", maxCount: 5 },
  ]), reportController.reportUserById)
reportRouter.post("/report-post", 
    verifyAccessToken,
    cloudinary.upload.fields([
    { name: "photos", maxCount: 5 },
  ]), reportController.reportPostById)

//ADMIN
reportRouter.get("/get-all", [verifyAccessToken, isAdmin], reportController.getAllReports);


module.exports = reportRouter;