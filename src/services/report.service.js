const {Report, User, Post} = require("../models/index")
const {cloudinary} = require("../configs/cloudinary")
const fs = require("fs")

//USER
async function reportUser(reporterId, { userId, reportType, reason }, files) {
  try {
    const report = await Report.find({reportedBy: reporterId, user: userId})
    if(report){
      throw new Error("Vui lòng chờ duyệt báo cáo trước đó")
    }

    const reportedUser = await User.findById(userId);
    if (!reportedUser) {
      throw new Error("Không tìm thấy user");
    }
    let tempFilePaths = [];
    let uploadImages = [];

    if (files?.photos?.length > 0) {
      for (photo of files.photos) {
        tempFilePaths.push(photo.path);
      }
    }

    if (files.photos.length > 0) {
      try {
        const photosImages = files.photos;
        for (photo of photosImages) {
          const uploadResult = await cloudinary.uploader.upload(photo.path, {
            folder: "report_photos",
            resource_type: "image",
          });
          uploadImages.push(uploadResult.secure_url);
          fs.unlink(photo.path, (err) => {
            if (err) console.error("Error deleting local photos file:", err);
          });
        }
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        for (const filePath of tempFilePaths) {
          fs.unlink(filePath, (err) => {
            if (err)
              console.error("Error deleting file in catch:", filePath, err);
          });
        }
        throw new Error("Lỗi khi tải lên ảnh report. Vui lòng thử lại.");
      }
    }

    if (files?.photos?.length > 0) {
      await Report.create({
        reportedBy: reporterId,
        user: userId,
        reportType,
        reason,
        status: "pending",
        photos: uploadImages,
      });
    } else {
      await Report.create({
        reportedBy: reporterId,
        user: userId,
        reportType,
        reason,
        status: "pending",
      });
    }

    return {
      status: 200,
      message: "Báo cáo user thành công!",
    };
  } catch (error) {
    throw error;
  }
}
async function reportPost(reporterId, { postId, reportType, reason }, files) {
  try {
    const report = await Report.find({reportedBy: reporterId, post: postId})
    if(report){
      throw new Error("Vui lòng chờ duyệt báo cáo trước đó")
    }

    const reportedPost = await Post.findById(postId);
    if (!reportedPost) {
      throw new Error("Không tìm thấy post");
    }
    let tempFilePaths = [];
    let uploadImages = [];

    if (files?.photos?.length > 0) {
      for (photo of files.photos) {
        tempFilePaths.push(photo.path);
      }
    }

    if (files.photos.length > 0) {
      try {
        const photosImages = files.photos;
        for (photo of photosImages) {
          const uploadResult = await cloudinary.uploader.upload(photo.path, {
            folder: "report_photos",
            resource_type: "image",
          });
          uploadImages.push(uploadResult.secure_url);
          fs.unlink(photo.path, (err) => {
            if (err) console.error("Error deleting local photos file:", err);
          });
        }
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        for (const filePath of tempFilePaths) {
          fs.unlink(filePath, (err) => {
            if (err)
              console.error("Error deleting file in catch:", filePath, err);
          });
        }
        throw new Error("Lỗi khi tải lên ảnh report. Vui lòng thử lại.");
      }
    }

    if (files?.photos?.length > 0) {
      await Report.create({
        reportedBy: reporterId,
        post: postId,
        reportType,
        reason,
        status: "pending",
        photos: uploadImages,
      });
    } else {
      await Report.create({
        reportedBy: reporterId,
        post: postId,
        reportType,
        reason,
        status: "pending",
      });
    }

    return {
      status: 200,
      message: "Báo cáo bài viết thành công!",
    };
  } catch (error) {
    throw error;
  }
}


//ADMIN
async function getAllReports(shelterId) {
  try {
    return await Report.find({});
  } catch (error) {
    throw error;
  }
}


const reportService = {
  //USER
  reportUser,
  reportPost,


  //ADMIN
  getAllReports,
};

module.exports = reportService;
