import express from "express";
import Category from "../models/Category.models.js";
const router = express.Router();

// Get all categories
router.get("/api/categories", async (req, res) => {
  const categories = await Category.find();
  res.json({ data: { categories } });
});

// Get category by ID
router.get("/api/categories/:categoryId", async (req, res) => {
  const category = await Category.findById(req.params.categoryId);
  res.json({ data: { category } });
});

export default router;