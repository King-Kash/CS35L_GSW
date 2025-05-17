import Review from '../models/review_model.js';

const createReview = async (req, res) => {
  try {
    const { rating, user, contents, location } = req.body;

    // Create a new review document
    const newReview = new Review({
      rating,
      user,
      contents,
      location
    });

    // Save to database
    const savedReview = await newReview.save();

    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
};

export default createReview;