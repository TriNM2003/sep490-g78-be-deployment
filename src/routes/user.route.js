const express = require ("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const { userController } = require("../controllers");

userRouter.use(bodyParser.json());


userRouter.get("/", userController.getAllUsers);
userRouter.get("/:userId", userController.getUserById);
userRouter.put("/:userId/change-password", userController.changePassword);
userRouter.put("/:userId/edit-profile", userController.editProfile);

module.exports = userRouter;