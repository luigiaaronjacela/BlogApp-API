const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  // Add other fields like createdAt, etc.
});

module.exports = mongoose.model('Blog', blogSchema);