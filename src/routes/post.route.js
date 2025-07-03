const express = require ("express");
const postRouter = express.Router();
const bodyParser = require("body-parser");
const {verifyAccessToken} = require("../middlewares/auth.middleware");
const cloudinary = require("../configs/cloudinary");
const { postController } = require("../controllers");
postRouter.use(bodyParser.json());

postRouter.get("/get-posts-list", postController.getPostsList);
postRouter.get("/:postId", postController.getPostDetail);
postRouter.post("/create",
  verifyAccessToken,
  cloudinary.upload.array("photos", 7),
  (err, req, res, next) => {
    if (err?.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Tối đa 7 ảnh được phép đăng." });
    }
    next();
  },
  postController.createPost
);

postRouter.put("/:postId/edit",
  verifyAccessToken,
  cloudinary.upload.array("photos", 7),
  (err, req, res, next) => {
    if (err?.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Chỉ được tải lên tối đa 7 ảnh." });
    }
    next();
  },
  postController.editPost
);
postRouter.delete("/:postId", postController.deletePost);
postRouter.post("/react/:postId", verifyAccessToken, postController.reactPost);
postRouter.post("/:postId/report",
  verifyAccessToken,
  cloudinary.upload.array("photos", 5),
  (err, req, res, next) => {
    if (err?.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Chỉ được tải lên tối đa 5 ảnh." });
    }
    next();
  },
  postController.reportPost
);
postRouter.post("/:postId/comment",verifyAccessToken,  postController.createComment);
postRouter.put("/:postId/comment/edit/:commentId",verifyAccessToken, postController.editComment);
postRouter.delete("/:postId/comment/:commentId",verifyAccessToken, postController.removeComment);
postRouter.get("/:postId/comments", postController.getCommentsByPost);

module.exports = postRouter;