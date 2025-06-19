const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const { userController } = require("../controllers");
const cloudinary = require("../configs/cloudinary");

userRouter.use(bodyParser.json());

userRouter.get("/", userController.getAllUsers);
userRouter.get("/:userId", userController.getUserById);
userRouter.put("/:userId/change-password", userController.changePassword);
userRouter.put("/:userId/edit-profile",
  cloudinary.upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  userController.editProfile
);

module.exports = userRouter;
