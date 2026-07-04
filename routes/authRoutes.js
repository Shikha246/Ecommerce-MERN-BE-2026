
import { Router } from "express";
import { signup, login,getUserProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/signup", signup);
router.post("/login", login);
// Protected route (Notice 'protect' sits in the middle to guard the profile)
router.get("/profile", protect, getUserProfile);
export default router;