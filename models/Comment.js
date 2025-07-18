const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  blog:   { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text:   String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);