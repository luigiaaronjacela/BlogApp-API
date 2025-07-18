const jwt = require("jsonwebtoken");
require('dotenv').config();

// Secret key for signing JWTs
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "BlogApp";

// [SECTION] Create JWT Access Token
module.exports.createAccessToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin
  };

  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
};

// [SECTION] Verify JWT from Authorization Header
module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ auth: "Failed", message: "No token provided" });
  }

  token = token.slice(7).trim(); // Remove "Bearer " prefix

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ auth: "Failed", message: err.message });
    }

    req.user = decoded;
    next();
  });
};

// [SECTION] Middleware to check if user is admin
module.exports.verifyAdmin = (req, res, next) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    return res.status(403).json({
      auth: "Failed",
      message: "Action Forbidden: Admins only"
    });
  }
};

// [SECTION] Centralized Error Handler
module.exports.errorHandler = (err, req, res, next) => {
  console.error("Error caught by middleware:", err);

  const statusCode = err.status || 500;
  const errorMessage = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message: errorMessage,
      errorCode: err.code || 'SERVER_ERROR',
      details: err.details || null
    }
  });
};