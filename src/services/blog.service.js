const {cloudinary} = require("../configs/cloudinary");
const { Blog } = require("../models");
const fs = require("fs")

//USER
async function getAllBlogs() {
  try {
    return await Blog.find({})
  } catch (error) {
    throw error;
  }
}
async function getBlogByShelter(shelterId) {
  try {
    return await Blog.find({shelter: shelterId})
  } catch (error) {
    throw error;
  }
}
async function createBlog({shelter, title, description, content}, files) {
  try {
    let tempFilePaths = [];
    let uploadedThumbnailURL;


    if (files?.thumbnail_url?.length > 0) {
      tempFilePaths.push(files.thumbnail_url[0].path);
    }
    if(files.thumbnail_url?.length > 0){
      try {
            const thumbnailImageFile = files.thumbnail_url[0];
            const uploadResult = await cloudinary.uploader.upload(thumbnailImageFile.path, {
              folder: "blog_thumbnails",
              resource_type: "image",
            });
            uploadedThumbnailURL = uploadResult.secure_url;
            fs.unlink(thumbnailImageFile.path, (err) => {
              if (err) console.error("Error deleting local thumbnail file:", err);
            });
          } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            for (const filePath of tempFilePaths) {
              fs.unlink(filePath, (err) => {
                if (err)
                  console.error("Error deleting file in catch:", filePath, err);
              });
            }
            throw new Error("Lỗi khi tải lên ảnh thumbnail. Vui lòng thử lại.");
          }
    }
    

    const newBlog = await Blog.create({
      shelter, 
      thumbnail_url: uploadedThumbnailURL, 
      title, 
      description, 
      content
    })
    return newBlog;
  } catch (error) {
    throw error;
  }
}
async function editBlog({blogId, title, description, content}, files) {
  try {
    let updatedBlog;
    let tempFilePaths = [];
    let uploadedThumbnailURL;


    if (files?.thumbnail_url?.length > 0) {
      tempFilePaths.push(files.thumbnail_url[0].path);
    }
    if(files.thumbnail_url?.length > 0){
      try {
            const thumbnailImageFile = files.thumbnail_url[0];
            const uploadResult = await cloudinary.uploader.upload(thumbnailImageFile.path, {
              folder: "blog_thumbnails",
              resource_type: "image",
            });
            uploadedThumbnailURL = uploadResult.secure_url;
            fs.unlink(thumbnailImageFile.path, (err) => {
              if (err) console.error("Error deleting local thumbnail file:", err);
            });
          } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            for (const filePath of tempFilePaths) {
              fs.unlink(filePath, (err) => {
                if (err)
                  console.error("Error deleting file in catch:", filePath, err);
              });
            }
            throw new Error("Lỗi khi tải lên ảnh thumbnail. Vui lòng thử lại.");
          }
    }
    if(files?.thumbnail_url?.length > 0){
      updatedBlog = await Blog.findByIdAndUpdate(blogId,
      {
        thumbnail_url: uploadedThumbnailURL,
        title: title,
        description: description,
        content: content,
      },
      {new: true}
    )
    }else{
      await Blog.findByIdAndUpdate(blogId,
      {
        title: title,
        description: description,
        content: content,
      },
      {new: true}
    )
    }
    
    return {
      status: 200,
      blog: updatedBlog
    };
  } catch (error) {
    throw error;
  }
}
async function deleteBlog(blogId) {
  try {
    const blog = Blog.findById(blogId);
    if(!blog){
      throw new Error("Blog không tồn tại!")
    }
    await Blog.findByIdAndDelete(blogId);
    
    return {
      status: 200,
      message: "Xóa blog thành công!"
    };
  } catch (error) {
    throw error;
  }
}


// ADMIN
async function approveBlog(blogId) {
  try {
    const blog = await Blog.findById(blogId);
    blog.status = "published"
    return {
      status: 200,
      message: "Chấp thuận blog thành công"
    };
  } catch (error) {
    throw error;
  }
}

const blogService = {
  //USER
  getAllBlogs,
  getBlogByShelter,
  createBlog,
  editBlog,
  deleteBlog,

  //ADMIN
  approveBlog,
};

module.exports = blogService;
