import mongoose from "mongoose";

//Template for individual review documents
const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contents: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true //Adds createdAt and updatedAt
});

//Review model
const Review = mongoose.model('Review', reviewSchema); //Singular and Capital for model name.
export default Review;