import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,

  items: [
    {
      productId: String,
      name: String,
      price: Number,
      qty: Number
    }
  ],

  // address: {
  //   type: String,
  //   required: true
  // },
address: {
  name: String,
  street: String,
  city: String,
  state: String,
  pincode: String
},
  total: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Order", orderSchema);