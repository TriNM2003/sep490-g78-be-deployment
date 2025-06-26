const express = require("express");
const adminRouter = express.Router();
const bodyParser = require("body-parser");
const { adminController } = require("../controllers");
const {
  verifyAccessToken,
  isAdmin,
} = require("../middlewares/auth.middleware");

adminRouter.use(bodyParser.json());
adminRouter.post(
  "/add-user",
  //[verifyAccessToken, isAdmin],
  adminController.addUser
);
adminRouter.put(
  "/change-roles/:userId",
  //[verifyAccessToken, isAdmin],
  adminController.changeUserRole
);
adminRouter.put(
  "/ban-user/:userId",
  //[verifyAccessToken, isAdmin],
  adminController.banUser
);
adminRouter.put(
  "/unban-user/:userId",
  //[verifyAccessToken, isAdmin],
  adminController.unbanUser
);

module.exports = adminRouter;
