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
  reportRouter.post("/report-blog", 
    verifyAccessToken,
    cloudinary.upload.fields([
    { name: "photos", maxCount: 5 },
  ]), reportController.reportBlogById)

//ADMIN
reportRouter.get("/admin/get-user-reports", [verifyAccessToken, isAdmin], reportController.getUserReports);
reportRouter.get("/admin/get-pending-user-reports", [verifyAccessToken, isAdmin], reportController.getPendingUserReports);
reportRouter.put("/admin/review/user/:reportId/:decision", [verifyAccessToken, isAdmin], reportController.reviewUserReport);

reportRouter.get("/admin/get-pending-post-reports", [verifyAccessToken, isAdmin], reportController.getPendingPostReports);

module.exports = reportRouter;