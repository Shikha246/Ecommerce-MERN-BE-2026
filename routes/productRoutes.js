import express from "express";
import Product from "../models/Product.models.js";

const router = express.Router();

// Get all products
router.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json({ data: { products } });
});

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