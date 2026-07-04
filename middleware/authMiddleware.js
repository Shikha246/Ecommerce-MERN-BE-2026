import jwt from "jsonwebtoken";
import User from "../models/User.models.js"; 

export const protect = async (req, res, next) => {
  let token;

  // 1. Check if the Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // 2. Extract the token string
      token = req.headers.authorization.split(" ")[1];

      // 3. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user in the database (excluding the password) and attach to req.user
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Move on to the actual route handler
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token found" });
  }
};