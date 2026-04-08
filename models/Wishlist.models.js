// import mongoose from "mongoose";

// const wishlistSchema = new mongoose.Schema({
//   userId: String,
//   productId: []
  
// });

// export default mongoose.model("Wishlist", wishlistSchema);

import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});

export default mongoose.model("Wishlist", wishlistSchema);