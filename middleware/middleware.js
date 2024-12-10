// authMiddleware.js
const dotenv = require("dotenv");
dotenv.config(); 

// Middleware function to check the token
const checkToken = (req, res, next) => {
  // Get the token from the request header
  const token = req.headers["authorization"];

  // If no token is provided, return Unauthorized
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Check if the token matches the one in the .env file
  if (token === `Bearer ${process.env.API_SECRET_TOKEN}`) {
    // If token matches, proceed to the next middleware or route handler
    next();
  } else {
    // If token does not match, return Unauthorized
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = checkToken;
