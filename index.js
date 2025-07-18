const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./auth');

dotenv.config(); // Load .env

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Config
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:4000', 'https://your-api.onrender.com/blogs'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/users', require('./routes/user'));
app.use('/blogs', require('./routes/blog'));
app.use('/comments', require('./routes/comment'));

// Error Handler
app.use(errorHandler);

// Start Server
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 API is now online at http://localhost:${PORT}`);
  });
}

module.exports = { app, mongoose };