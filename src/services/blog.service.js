const db = require("../models");
const { cloudinary } = require("../configs/cloudinary");
const fs = require("fs/promises");

const getListBlogs = async () => {
  try {
    const blogs = await db.Blog.find({ status: "published" })
      .populate("shelter")
      .sort({ createdAt: -1 });

    if (!blogs || blogs.length === 0) {
      throw new Error("Không có bài viết nào");
    }

    const result = blogs.map((blog) => ({
      _id: blog._id,
      shelter: {
        _id: blog.shelter._id,
        name: blog.shelter.name,
        shelterCode: blog.shelter.shelterCode,
        avatar: blog.shelter.avatar,
      },
      thumbnailUrl: blog.thumbnail_url,
      title: blog.title,
      description: blog.description,
      content: blog.content,
      status: blog.status,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }));

    return result;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết:", error);
    throw new Error("Không thể lấy danh sách bài viết");
  }
};

const getBlogById = async (blogId) => {
  try {
    const blog = await db.Blog.findById(blogId, {
      status: "published",
    }).populate("shelter");
    return {
      _id: blog._id,
      shelter: {
        _id: blog.shelter._id,
        name: blog.shelter.name,
        shelterCode: blog.shelter.shelterCode,
        avatar: blog.shelter.avatar,
      },
      thumbnailUrl: blog.thumbnail_url,
      title: blog.title,
      description: blog.description,
      content: blog.content,
      status: blog.status,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };
  } catch (error) {
    console.error("Lỗi khi lấy bài viết:", error);
    throw new Error("Bài viết không tồn tại");
  }
};

const getListBlogsByShelter = async (shelterId) => {
  try {
    const blogs = await db.Blog.find({
      shelter: shelterId,
      status: "published",
    })
      .populate("shelter")
      .sort({ createdAt: -1 });
    if (!blogs || blogs.length === 0) {
      throw new Error("Không có bài viết nào của trạm cứu hộ này");
    }

    const result = blogs.map((blog) => ({
      _id: blog._id,
      shelter: {
        _id: blog.shelter._id,
        name: blog.shelter.name,
        shelterCode: blog.shelter.shelterCode,
        avatar: blog.shelter.avatar,
      },
      thumbnailUrl: blog.thumbnail_url,
      title: blog.title,
      description: blog.description,
      content: blog.content,
      status: blog.status,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }));

    return result;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết của trạm cứu hộ:", error);
    throw new Error("Không thể lấy danh sách bài viết của trạm cứu hộ");
  }
};

const createBlog = async (blogData, shelterId, file) => {
  try {
    const { title, description, content } = blogData;

    if (!shelterId) {
      throw new Error("ID trạm cứu hộ không được cung cấp");
    }

    if (!title || !content) {
      throw new Error("Tiêu đề và nội dung bài viết là bắt buộc");
    }

    let thumbnailUrl = "";
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "blogs",
        resource_type: "image",
      });
      thumbnailUrl = uploadResult.secure_url;
      await fs.unlink(file.path);
    }

    const newBlog = await db.Blog.create({
      shelter: shelterId,
      thumbnail_url: thumbnailUrl,
      title,
      description,
      content,
      status: "moderating",
    });
    return newBlog;
  } catch (error) {
    if (file && file.path) {
      await fs.unlink(file.path);
    }
    console.error("Lỗi khi tạo bài viết:", error);
    throw new Error("Không thể tạo bài viết");
  }
};

const updateBlog = async (blogId, blogData, file) => {
  try {
    const { title, description, content } = blogData;

    if (!blogId) {
      throw new Error("ID bài viết không được cung cấp");
    }

    if (!title || !content) {
      throw new Error("Tiêu đề và nội dung bài viết là bắt buộc");
    }

    let thumbnailUrl = "";
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "blogs",
        resource_type: "image",
      });
      thumbnailUrl = uploadResult.secure_url;
      await fs.unlink(file.path);
    }

    const updatedBlog = await db.Blog.findByIdAndUpdate(
      blogId,
      {
        thumbnail_url: thumbnailUrl,
        title,
        description,
        content,
      },
      { new: true }
    );

    return updatedBlog;
  } catch (error) {
    if (file && file.path) {
      await fs.unlink(file.path);
    }
    console.error("Lỗi khi cập nhật bài viết:", error);
    throw new Error(error.message);
  }
};

const deleteBlog = async (blogId) => {
  try {
    if (!blogId) {
      throw new Error("ID bài viết không được cung cấp");
    }

    const deletedBlog = await db.Blog.findByIdAndUpdate(
      blogId,
      { status: "deleted" },
      { new: true }
    );

    return deletedBlog;
  } catch (error) {
    console.error("Lỗi khi xóa bài viết:", error);
    throw new Error("Không thể xóa bài viết");
  }
};

const blogService = {
  getListBlogs,
  getBlogById,
  getListBlogsByShelter,
  createBlog,
  updateBlog,
  deleteBlog,
};

module.exports = blogService;
