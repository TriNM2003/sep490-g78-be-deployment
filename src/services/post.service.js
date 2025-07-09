const db = require("../models");
const { cloudinary } = require("../configs/cloudinary");
const fs = require("fs/promises");

const getPostsList = async (userId) => {
  try {
    const filter = {
      status: "active",
      $or: [{ privacy: "public" }],
    };

    // Nếu có userId, cho phép thêm bài private của chính họ
    if (userId) {
      filter.$or.push({
        $and: [{ privacy: "private" }, { createdBy: userId }],
      });
    }

    const posts = await db.Post.find(filter)
      .populate("createdBy")
      .populate("likedBy");

    // Dùng Promise.all để lấy latestComment cho từng post
    const result = await Promise.all(
      posts.map(async (post) => {
        const latestComment = await db.Comment.findOne({
          post: post._id,
          status: "visible",
        })
          .sort({ createdAt: -1 })
          .populate("commenter", "fullName avatar");

        return {
          _id: post._id,
          title: post.title,
          createdBy: {
            _id: post.createdBy._id,
            fullName: post.createdBy.fullName,
            avatar: post.createdBy.avatar,
          },
          photos: post.photos,
          privacy: post.privacy,
          likedBy: post.likedBy.map((user) => ({
            _id: user._id,
            fullName: user.fullName,
            avatar: user.avatar,
          })),
          latestComment: latestComment
            ? {
                _id: latestComment._id,
                message: latestComment.message,
                commenter: {
                  _id: latestComment.commenter._id,
                  fullName: latestComment.commenter.fullName,
                  avatar: latestComment.commenter.avatar,
                },
                createdAt: latestComment.createdAt,
              }
            : null,
          status: post.status,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        };
      })
    );

    return result;
  } catch (error) {
    throw error;
  }
};

const getPostDetail = async (postId) => {
  try {
    const post = await db.Post.findById(postId)
      .populate("createdBy")
      .populate("likedBy");
    if (!post) {
      throw new Error("Post not found");
    }

    return {
      _id: post._id,
      title: post.title,
      createdBy: {
        _id: post.createdBy._id,
        fullName: post.createdBy.fullName,
        avatar: post.createdBy.avatar,
      },
      photos: post.photos.map((photo) => photo),
      privacy: post.privacy || "public",
      likedBy: post.likedBy.map((user) => ({
        _id: user._id,
        fullName: user.fullName,
        avatar: user.avatar,
      })),
      status: post.status,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  } catch (error) {
    throw error;
  }
};

const createPost = async (userId, postData, files) => {
  const uploadedPhotoUrls = [];
  const tempFilePaths = [];

  try {
    if (Array.isArray(files)) {
      for (const file of files) {
        tempFilePaths.push(file.path);
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "posts",
            resource_type: "image",
          });
          uploadedPhotoUrls.push(result.secure_url);
          await fs.unlink(file.path); // xoá file tạm thành công
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          await Promise.all(
            tempFilePaths.map((path) => fs.unlink(path).catch(() => {}))
          );
          throw new Error("Lỗi khi upload ảnh lên Cloudinary");
        }
      }
    }

    const newPost = await db.Post.create({
      createdBy: userId,
      title: postData.title,
      privacy: postData.privacy || "public",
      photos: uploadedPhotoUrls,
      status: "active",
    });

    return newPost;
  } catch (error) {
    await Promise.all(
      tempFilePaths.map((path) => fs.unlink(path).catch(() => {}))
    );
    throw new Error("Lỗi khi tạo bài viết: " + error.message);
  }
};

const editPost = async (userId, postId, postData, files) => {
  const tempFilePaths = [];
  const uploadedPhotos = [];

  try {
    const post = await db.Post.findById(postId);
    if (!post) throw new Error("Không tìm thấy bài viết");

    if (post.createdBy.toString() !== userId.toString()) {
      throw new Error("Bạn không có quyền chỉnh sửa bài viết này.");
    }

    if (Array.isArray(files)) {
      for (const file of files) {
        tempFilePaths.push(file.path);
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "posts",
            resource_type: "image",
          });
          uploadedPhotos.push(result.secure_url);
          await fs.unlink(file.path);
        } catch (uploadErr) {
          console.error("Upload error:", uploadErr);
          await Promise.all(
            tempFilePaths.map((path) => fs.unlink(path).catch(() => {}))
          );
          throw new Error("Không thể upload ảnh mới");
        }
      }
    }

    const keepPhotos = postData.existingPhotos
      ? JSON.parse(postData.existingPhotos)
      : post.photos;

    const updatedPost = await db.Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          title: postData.title || post.title,
          privacy: postData.privacy || post.privacy,
          photos: [...keepPhotos, ...uploadedPhotos],
        },
      },
      { new: true }
    );

    return updatedPost;
  } catch (error) {
    await Promise.all(
      tempFilePaths.map((path) => fs.unlink(path).catch(() => {}))
    );
    throw new Error("Lỗi khi cập nhật bài viết: " + error.message);
  }
};

const deletePost = async (postId) => {
  try {
    const post = await db.Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    post.status = "deleted";
    await post.save();

    return {
      success: true,
      message: "Post deleted successfully",
      data: {
        _id: post._id,
        title: post.title,
        createdBy: {
          _id: post.createdBy._id,
          fullName: post.createdBy.fullName,
          avatar: post.createdBy.avatar,
        },
        status: post.status,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    };
  } catch (error) {
    throw error;
  }
};

const reactPost = async (postId, userId) => {
  try {
    const post = await db.Post.findOne({ _id: postId });

    if (!post) {
      throw new Error("Post not found");
    }

    const hasLiked = post.likedBy.includes(userId);

    const update = hasLiked
      ? { $pull: { likedBy: userId } }
      : { $addToSet: { likedBy: userId } };

    const updatedPost = await db.Post.findByIdAndUpdate(postId, update, {
      new: true,
    });

    return updatedPost;
  } catch (error) {
    throw new Error("Error reacting to post: " + error.message);
  }
};

const reportPost = async (userId, postId, reason, files) => {
  const tempFilePaths = [];
  const uploadedPhotos = [];

  try {
    if (Array.isArray(files) && files.length > 0) {
      for (const file of files) {
        tempFilePaths.push(file.path);
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "reports",
          resource_type: "image",
        });
        uploadedPhotos.push(result.secure_url);
        fs.unlink(file.path, (err) => {
          if (err) console.error("Lỗi xóa ảnh tạm:", err);
        });
      }
    }

    const newReport = await db.Report.create({
      reportType: "post",
      postReported: postId,
      reportedBy: userId,
      reason,
      photos: uploadedPhotos,
      status: "pending",
    });
    return newReport;
  } catch (error) {
    for (const path of tempFilePaths) {
      fs.unlink(path, (err) => {
        if (err) console.error("Lỗi xóa ảnh tạm:", err);
      });
    }
    throw new Error("Lỗi khi báo cáo bài viết: " + error.message);
  }
};

const createComment = async ({ postId, userId, message }) => {
  try {
    const comment = await db.Comment.create({
      post: postId,
      commenter: userId,
      message,
    });
    return comment;
  } catch (error) {
    throw new Error("Error creating comment: " + error.message);
  }
};

const editComment = async (commentId, userId, message) => {
  try {
    const comment = await db.Comment.findOneAndUpdate(
      { _id: commentId, commenter: userId },
      { message, updatedAt: new Date() },
      { new: true }
    );

    if (!comment) {
      throw new Error("Comment not found or permission denied");
    }

    return comment;
  } catch (error) {
    throw new Error("Error editing comment: " + error.message);
  }
};

const removeComment = async (commentId, userId) => {
  try {
    const comment = await db.Comment.findOneAndUpdate(
      { _id: commentId, commenter: userId },
      { status: "deleted" },
      { new: true }
    );

    if (!comment) {
      throw new Error("Comment not found or permission denied");
    }

    return comment;
  } catch (error) {
    throw new Error("Error deleting comment: " + error.message);
  }
};

const getCommentsByPost = async (postId) => {
  try {
    const comments = await db.Comment.find({
      post: postId,
      status: "visible",
    })
      .populate("commenter", "fullName avatar")
      .sort({ createdAt: -1 });

    return comments.map((comment) => ({
      _id: comment._id,
      message: comment.message,
      commenter: {
        _id: comment.commenter._id,
        fullName: comment.commenter.fullName,
        avatar: comment.commenter.avatar,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
  } catch (error) {
    throw new Error("Error fetching comments: " + error.message);
  }
};

const postService = {
  getPostsList,
  getPostDetail,
  createPost,
  editPost,
  deletePost,
  reactPost,
  reportPost,
  createComment,
  editComment,
  removeComment,
  getCommentsByPost,
};

module.exports = postService;
