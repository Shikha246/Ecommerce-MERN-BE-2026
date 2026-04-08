import express from "express";
import Wishlist from "../models/Wishlist.models.js";

const router = express.Router();


// ✅ GET wishlist
router.get("/wishlist/:userId", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId });

    res.json({
      products: wishlist?.products || []
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ ADD item
router.post("/wishlist/add", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      {
        $addToSet: { products: productId } // avoids duplicates
      },
      { new: true, upsert: true }
    );

    res.json({
      products: wishlist.products
    });
console.log("This is res.data:",res.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ REMOVE item
router.delete("/wishlist/remove/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      {
        $pull: { products: productId }
      },
      { new: true }
    );

    res.json({
      products: wishlist?.products || []
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;