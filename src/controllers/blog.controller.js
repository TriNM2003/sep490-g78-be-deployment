const blogService = require("../services/blog.service");
const fs = require("fs/promises");

//USER
const getBlogsByShelter = async (req, res) => {
  try {
    const blogs = await blogService.getBlogByShelter(req.params.shelterId);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getListBlogs = async (req, res) => {
  try {
    const blogs = await blogService.getListBlogs();
    if (!blogs) {
      return res.status(404).json({
        success: false,
        message: error.message || "Không có bài viết nào",
      });
    }
    res.status(200).json({
      success: true,
      message: "Danh sách bài viết",
      data: blogs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi lấy danh sách bài viết",
    });
  }
};

const getBlogById = async (req, res) => {
  const blogId = req.params.id;
  if (!blogId) {
    return res.status(400).json({
      success: false,
      message: error.message || "ID bài viết không được cung cấp",
    });
  }
  try {
    const blog = await blogService.getBlogById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: error.message || "Bài viết không tồn tại",
      });
    }
    res.status(200).json({
      success: true,
      message: "Chi tiết bài viết",
      data: blog,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi lấy chi tiết bài viết",
    });
  }
};

const getListBlogsByShelter = async (req, res) => {
  const shelterId = req.params.shelterId;
  if (!shelterId) {
    return res.status(400).json({
      success: false,
      message: error.message || "ID trạm cứu hộ không được cung cấp",
    });
  }
  try {
    const blogs = await blogService.getListBlogsByShelter(shelterId);
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: error.message || "Không có bài viết nào của trạm cứu hộ này",
      });
    }

    res.status(200).json({
      success: true,
      message: "Danh sách bài viết của trạm cứu hộ",
      data: blogs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error.message || "Lỗi khi lấy danh sách bài viết của trạm cứu hộ",
    });
  }
};

const createBlog = async (req, res) => {
  const { title, description, content } = req.body;
  const shelterId = req.params.shelterId;
  const file = req.file;

  if (!shelterId) {
    await fs.unlink(file.path).catch((err) => {
      console.error("Lỗi khi xóa tệp:", err);
    });
    return res.status(404).json({
      success: false,
      message: "ID trạm cứu hộ không được cung cấp",
    });
  }

  try {
    const newBlog = await blogService.createBlog(
      { title, description, content },
      shelterId,
      file
    );
    res.status(201).json({
      success: true,
      message: "Bài viết đã được tạo thành công",
      data: newBlog,
    });
  } catch (error) {
    await fs.unlink(file.path).catch((err) => {
      console.error("Lỗi khi xóa tệp:", err);
    });
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi tạo bài viết",
    });
  }
};

const updateBlog = async (req, res) => {
  const { blogId } = req.params;
  const { title, description, content } = req.body;
  const file = req.file;

  if (!blogId) {
    await fs.unlink(file.path).catch((err) => {
      console.error("Lỗi khi xóa tệp:", err);
    });
    return res.status(404).json({
      success: false,
      message: "ID bài viết không được cung cấp",
    });
  }

  try {
    const updatedBlog = await blogService.updateBlog(
      blogId,
      { title, description, content },
      file
    );
    res.status(200).json({
      success: true,
      message: "Bài viết đã được cập nhật thành công",
      data: updatedBlog,
    });
  } catch (error) {
    await fs.unlink(file.path).catch((err) => {
      console.error("Lỗi khi xóa tệp:", err);
    }); 
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi cập nhật bài viết",
    });
  }
};

const deleteBlog = async (req, res) => {
  const { blogId } = req.params;

  if (!blogId) {
    return res.status(404).json({
      success: false,
      message: "ID bài viết không được cung cấp",
    });
  }

  try {
    await blogService.deleteBlog(blogId);
    res.status(200).json({
      success: true,
      message: "Bài viết đã được xóa thành công",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi xóa bài viết",
    });
  }
};




//ADMIN
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogService.getAllBlogs();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const approveBlog = async (req, res) => {
  try {
    const response = await blogService.approveBlog(req.params.blogId)
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const blogController = {
    //USER
    getListBlogs,
    getBlogById,
    getListBlogsByShelter,
    getAllBlogs,
    getBlogsByShelter,
    createBlog,
    updateBlog,
    deleteBlog,

    //ADMIN
    approveBlog,
};

module.exports = blogController;
