import jwt from "jsonwebtoken";
import User from "../models/User.models.js";

// Like `protect`, but doesn't reject the request if there's no/invalid token —
// it just leaves req.user undefined, so the chatbot can still answer
// product/policy questions for guests.
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
    } catch (error) {
      req.user = null; // invalid/expired token — proceed as guest
    }
  }

  next();
};