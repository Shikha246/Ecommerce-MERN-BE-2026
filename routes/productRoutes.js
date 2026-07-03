import express from "express";
import Product from "../models/Product.models.js";
import {Link} from "react-router-dom";
const router = express.Router();

// Get all products
router.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json({ data: { products } });
});
// getting best sellers book 

router.get("/api/products/bestsellers", async (req,res) =>{
  try {
    // 1. Find products, sort by sales_count from highest to lowest (-1), and limit to top 6 items
    const bestSellers = await Product.find()
      .sort({ sales_count: -1 })
      .limit(6);

    // 2. Send the top books back to the frontend
    res.status(200).json(bestSellers);
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    res.status(500).json({ message: "Server error fetching best sellers" });
  }
})
// Get product by ID
router.get("/api/products/:productId", async (req, res) => {
  const product = await Product.findById(req.params.productId);
  res.json({ data: { product } });
});

// adding data to database
router.post("/api/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      data: { product: savedProduct }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding product",
      error: error.message
    });
  }
});




export default router;