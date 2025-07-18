const router = require('express').Router();
const { verify, verifyAdmin } = require('../auth'); // Rename 'auth' to 'verify'
const {
  addComment,
  getComments,
  deleteComment
} = require('../controllers/comment');

// Public: View comments for a blog post
router.get('/:blogId', getComments);

// Authenticated: Add a comment
router.post('/:blogId', verify, addComment);

// Authenticated: Delete a comment (author or admin should be checked in controller)
router.delete('/:id', verify, deleteComment);

module.exports = router;