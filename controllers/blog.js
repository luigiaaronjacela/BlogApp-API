const mongoose = require('mongoose');
const Blog = require('../models/Blog'); // Adjust path as needed


// [POST] Create blog
exports.createBlog = async (req, res, next) => {
  try {
    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id // ✅ Sets the author to the logged-in user
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
};

// [GET] All blogs
exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().populate('author', 'username');
    res.json(blogs);
  } catch (err) {
    next(err);
  }
};

// [GET] Single blog
exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');
    if (!blog) return res.status(404).json({ message: 'Not found' });
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// [PUT] Update blog
exports.updateBlog = async (req, res, next) => {
  try {
    console.log('req.user:', req.user); // ✅ Check token
    console.log('req.body:', req.body); // ✅ Check input
    console.log('req.params.id:', req.params.id); // ✅ Check ID

    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(blogId);
    if (!blog)
      return res.status(404).json({ message: 'Blog not found' });

    if (!blog.author) {
      return res.status(500).json({ message: 'Blog author missing' });
    }

    if (blog.author.toString() !== req.user.id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Not the author or admin' });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;

    const updatedBlog = await blog.save();
    res.json({ message: 'Blog updated', blog: updatedBlog });

  } catch (err) {
    next(err);
  }
};

// [DELETE] Delete blog
exports.deleteBlog = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res.status(404).json({ message: 'Blog not found' });

    // 💥 Check if blog.author exists before toString()
    if (!blog.author) {
      return res.status(500).json({ message: 'Blog author not set' });
    }

    if (blog.author.toString() !== req.user.id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    next(err);
  }
};