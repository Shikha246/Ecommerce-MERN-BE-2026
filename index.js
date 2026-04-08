import express from "express";
import { initializeDatabase } from "./db/db.connect.js";

import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());


// ✅ Connect DB here
initializeDatabase();

// ✅ Routes
app.use(productRoutes);
app.use(categoryRoutes);
app.use("/api",cartRoutes);
app.use("/api",wishlistRoutes);
app.use("/api", addressRoutes);
app.use("/api",orderRoutes);

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});