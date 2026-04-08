// import express from "express";
// import Address from "../models/Address.models.js";

// const router = express.Router();

// // Get addresses
// router.get("/api/address/:userId", async (req, res) => {
//   const addresses = await Address.find({ userId: req.params.userId });
//   res.json(addresses);
// });

// // Add address
// router.post("/api/address/add", async (req, res) => {
//   const address = new Address(req.body);
//   await address.save();

//   res.json(address);
// });

// // Delete address
// router.delete("/api/address/delete/:id", async (req, res) => {
//   await Address.findByIdAndDelete(req.params.id);
//   res.json({ message: "Address deleted" });
// });

// export default router;
import express from "express";
import Address from "../models/Address.models.js";

const router = express.Router();


// ➕ Add Address
router.post("/address", async (req, res) =>  {
  debugger;
  try {
    const address = new Address(req.body);
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 📥 Get All Addresses (by user)
router.get("/:userId", async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ❌ Delete Address
router.delete("/:id", async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✏️ Update Address
router.put("/address/:id", async (req, res) => {
  debugger;
  try {
    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
