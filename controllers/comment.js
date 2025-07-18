const Comment = require('../models/Comment');

exports.getComments = async (req, res) => {
  const comments = await Comment.find({ blog: req.params.blogId }).populate('user', 'username');
  res.json(comments);
};

exports.addComment = async (req, res) => {
  const comment = await Comment.create({
    blog: req.params.blogId,
    user: req.user._id,
    text: req.body.text
  });
  res.status(201).json(comment);
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Only comment owner or admin can delete
    if (comment.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};