const express = require("express");
const blogRouter = express.Router();
const bodyParser = require("body-parser");
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const {isShelterStaff} = require("../middlewares/shelter.middleware");
const { isAdmin } = require("../middlewares/admin.middleware");
const { cloudinary } = require("../configs");
const blogController = require("../controllers/blog.controller");


blogRouter.use(bodyParser.json());

const {
  verifyAccessToken,
  optionalVerifyAccessToken,
} = require("../middlewares/auth.middleware");
const cloudinary = require("../configs/cloudinary");
const { blogController } = require("../controllers");
blogRouter.use(bodyParser.json());

blogRouter.get(
  "/get-blogs-list",
  optionalVerifyAccessToken,
  blogController.getListBlogs
);
blogRouter.get("/:blogId", optionalVerifyAccessToken, blogController.getBlogById);
blogRouter.get(
  "/:shelterId/get-by-shelter",
  optionalVerifyAccessToken,
  blogController.getListBlogsByShelter
);
blogRouter.post(
  "/create/:shelterId",
  verifyAccessToken,
  cloudinary.upload.single("thumbnail_url"),
  blogController.createBlog,
  
);
blogRouter.put(
  "/:blogId/update",
  verifyAccessToken,
  cloudinary.upload.single("thumbnail_url"),
  blogController.updateBlog,
  
);
blogRouter.delete("/:blogId/delete", verifyAccessToken, blogController.deleteBlog);




//USER
blogRouter.get("/get-all", blogController.getAllBlogs)
blogRouter.get("/get-by-shelter/:shelterId", blogController.getBlogsByShelter)
blogRouter.post("/create-blog/:shelterId", 
    [verifyAccessToken, isShelterStaff], 
    cloudinary.upload.fields([
    { name: "thumbnail_url", maxCount: 1 },
  ]), blogController.createBlog)
blogRouter.put("/edit-blog/:shelterId", 
    [verifyAccessToken, isShelterStaff], 
    cloudinary.upload.fields([
    { name: "thumbnail_url", maxCount: 1 },
  ]), blogController.editBlog)
blogRouter.delete("/delete-blog/:blogId", [verifyAccessToken, isShelterStaff], blogController.deleteBlog)

//ADMIN
blogRouter.put("/approve-blog/:blogId", [verifyAccessToken, isAdmin], blogController.approveBlog)


module.exports = blogRouter;

