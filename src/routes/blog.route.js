const express = require("express");
const blogRouter = express.Router();
const bodyParser = require("body-parser");
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

module.exports = blogRouter;
