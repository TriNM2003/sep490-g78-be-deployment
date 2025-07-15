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
blogRouter.get("/:blogId", optionalVerifyAccessToken, blogController.getPublishedBlogById);
blogRouter.get("/:shelterId/get-by-shelter", optionalVerifyAccessToken, blogController.getListBlogsByShelter);
blogRouter.get("/:shelterId/get-by-shelter/staff",[verifyAccessToken, isShelterStaff], blogController.getBlogsByShelter)
blogRouter.get("/:blogId/staff", [verifyAccessToken, isShelterStaff], blogController.getBlogById);
blogRouter.post("/create/:shelterId", [verifyAccessToken, isShelterStaff], cloudinary.upload.single("thumbnail_url"), blogController.createBlog);
blogRouter.put("/:blogId/update/:shelterId", [verifyAccessToken, isShelterStaff], cloudinary.upload.single("thumbnail_url"), blogController.updateBlog);
blogRouter.delete("/:blogId/delete/:shelterId", [verifyAccessToken, isShelterStaff], blogController.deleteBlog);
blogRouter.get("/:blogId/recommend/:shelterId", blogController.getRecommendedBlogs);

//ADMIN
blogRouter.get("/get-all", blogController.getAllBlogs)
blogRouter.put("/:blogId/moderate-blog/:decision", [verifyAccessToken, isAdmin], blogController.moderateBlog)


module.exports = blogRouter;
