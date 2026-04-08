import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  rating: Number,
  image: String,
  category: String,
  author: String,
  publisher: String,
  stock: Number
});

export default mongoose.model("Product", productSchema);