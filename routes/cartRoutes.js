import express from "express";
import Cart from "../models/Cart.models.js";

const router = express.Router();


// 🔹 Get Cart
router.get("/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 Add to Cart
router.post("/cart/add", async (req, res) => {
  try {
    const { userId, product } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId: product._id.toString(),
            name: product.name,
            price: product.price,
            image: product.image,
            qty: 1
          }
        ]
      });
    } else {
      const existingItem = cart.items.find(
        item => item.productId.toString() === product._id.toString()
      );

      if (existingItem) {
        existingItem.qty = 1;
      } else {
        cart.items.push({
          productId: product._id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1
        });
      }
    }

    await cart.save();
    res.json(cart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 Remove Item
router.delete("/cart/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();
    res.json(cart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 Update Quantity (+ / -)
router.put("/cart/update", async (req, res) => {
  try {
    const { userId, productId, action } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items
      .map(item => {
        if (item.productId.toString() === productId) {
          if (action === "inc") item.qty += 1;
          if (action === "dec") item.qty -= 1;
        }
        return item;
      })
      .filter(item => item.qty > 0);

    await cart.save();
    res.json(cart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//clear cart API
router.delete("/clear/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { items: [] },
      { new: true }
    );

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;