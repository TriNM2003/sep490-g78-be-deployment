const { Blog } = require("../models");
const {blogService} = require("../services/index")


//USER
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogService.getAllBlogs();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getBlogsByShelter = async (req, res) => {
  try {
    const blogs = await blogService.getBlogByShelter(req.params.shelterId);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const createBlog = async (req, res) => {
  try {
    const blog = await blogService.createBlog(req.body, req.files);
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const editBlog = async (req, res) => {
  try {
    const blog = await blogService.editBlog(req.body, req.files);
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const deleteBlog = async (req, res) => {
  try {
    const blog = await blogService.deleteBlog(req.params.blogId);
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//ADMIN
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
    getAllBlogs,
    getBlogsByShelter,
    createBlog,
    editBlog,
    deleteBlog,

    //ADMIN
    approveBlog,
};

module.exports = blogController;