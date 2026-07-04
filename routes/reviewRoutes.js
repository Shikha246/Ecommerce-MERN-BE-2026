import express from 'express';
import Review from '../models/Review.models.js'; // Note the mandatory .js extension for local files in ES Modules

const router = express.Router();



// 1. SUBMIT A NEW REVIEW in the database
router.post('/reviews', async (req, res) => {
  try {
    const { productId, username, rating, comment } = req.body;

    // Quick backend validation
    if (!productId || !username || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    const newReview = new Review({
      productId,
      username,
      rating,
      comment
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: "Server error saving review", error: error.message });
  }
});


// 2. GET ALL REVIEWS FOR A SPECIFIC PRODUCT
router.get('/reviews/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Find reviews and sort by newest first
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching reviews", error: error.message });
  }
});
export default router;