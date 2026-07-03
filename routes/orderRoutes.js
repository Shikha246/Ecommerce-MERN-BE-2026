import express from "express";
import Order from "../models/Order.models.js";

const router = express.Router();

// Place Order
router.post("/orders/place", async (req, res) => {
  try {
    const { userId, items, address, total } = req.body;

    const newOrder = new Order({
      userId,
      items,
      address,
      total
    });

    await newOrder.save();
for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId, 
        { $inc: { sales_count: item.qty } } // Notice we use item.qty here because that matches your schema!
      );
    }
    res.json(newOrder);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;