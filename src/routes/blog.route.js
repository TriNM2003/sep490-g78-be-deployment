const express = require("express");
const blogRouter = express.Router();
const bodyParser = require("body-parser");
const { verifyAccessToken, optionalVerifyAccessToken } = require("../middlewares/auth.middleware");
const {isShelterStaff} = require("../middlewares/shelter.middleware");
const { isAdmin } = require("../middlewares/admin.middleware");
const { cloudinary } = require("../configs");
const blogController = require("../controllers/blog.controller");

blogRouter.use(bodyParser.json());

//USER
blogRouter.get("/get-blogs-list", optionalVerifyAccessToken, blogController.getListBlogs);
blogRouter.get("/:blogId", optionalVerifyAccessToken, blogController.getBlogById);
blogRouter.get("/:shelterId/get-by-shelter", optionalVerifyAccessToken, blogController.getListBlogsByShelter);
blogRouter.get("/:shelterId/get-by-shelter/staff",[verifyAccessToken, isShelterStaff], blogController.getBlogsByShelter)
blogRouter.post("/create/:shelterId", [verifyAccessToken, isShelterStaff], cloudinary.upload.single("thumbnail_url"), blogController.createBlog);
blogRouter.put("/:blogId/update", [verifyAccessToken, isShelterStaff], cloudinary.upload.single("thumbnail_url"), blogController.updateBlog);
blogRouter.delete("/:blogId/delete", [verifyAccessToken, isShelterStaff], blogController.deleteBlog);

//ADMIN
blogRouter.get("/get-all", blogController.getAllBlogs)
blogRouter.put("/approve-blog/:blogId", [verifyAccessToken, isAdmin], blogController.approveBlog)


module.exports = blogRouter;
