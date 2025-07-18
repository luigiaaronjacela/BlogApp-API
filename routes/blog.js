const router = require('express').Router();
const { verify, verifyAdmin } = require('../auth'); // Adjusted to match your actual export names
const {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blog');

// Public Routes
router.get('/', getAllBlogs);       // Get all blogs
router.get('/:id', getBlog);        // Get single blog by ID

// Protected Routes (require token)
router.post('/', verify, createBlog);        // Authenticated users can create
router.put('/:id', verify, updateBlog);      // Only author can update
router.delete('/:id', verify, deleteBlog);   // Author or admin can delete

module.exports = router;