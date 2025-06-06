import Location from "../models/location_model.js";
import Review from "../models/review_model.js";
import User from "../models/user_model.js";
import mongoose from "mongoose";

// Search functionality for locations and reviews
export const search = async (req, res) => {
  try {
    const { searchTerm, tags } = req.body;
    
    // Build search query for locations
    const locationQuery = {};
    const reviewQuery = {};
    
    // Build conditions array for location search
    const locationConditions = [];
    // Build conditions array for review search
    const reviewConditions = [];
    
    if (searchTerm && searchTerm.trim()) {
      // Search in location name and description (case-insensitive)
      locationConditions.push({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      });
      
      // Search in review contents (case-insensitive)
      reviewConditions.push({
        contents: { $regex: searchTerm, $options: 'i' }
      });
    }
    
    // Add tags filter if provided
    if (tags && tags.length > 0) {
      const validTags = tags.filter(tag => tag && tag.trim());
      if (validTags.length > 0) {
        const tagFilter = { tags: { $in: validTags.map(tag => tag.toLowerCase().trim()) } };
        // Add tags filter to both locations and reviews
        locationConditions.push(tagFilter);
        reviewConditions.push(tagFilter);
      }
    }
    
    // Combine all conditions
    if (locationConditions.length > 0) {
      locationQuery.$and = locationConditions;
    }
    
    if (reviewConditions.length > 0) {
      reviewQuery.$and = reviewConditions;
    }
    
    // Search locations
    const locations = await Location.find(locationQuery)
      .populate('reviews')
      .sort({ rating: -1 })
      .limit(50);
    
    // Search reviews
    const reviews = await Review.find(reviewQuery)
      .populate('user', 'name')
      .populate('location', 'name _id')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json({
      success: true,
      locations,
      reviews,
      searchInfo: {
        searchTerm: searchTerm || '',
        tags: tags || [],
        locationCount: locations.length,
        reviewCount: reviews.length
      }
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error performing search',
      error: error.message 
    });
  }
};

// Recommendation algorithm based on user's rating history
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log('Recommendations request for userId:', userId);
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    // Get user's reviews to understand their preferences
    const userReviews = await Review.find({ user: userId })
      .populate('location')
      .sort({ rating: -1 });
    
    console.log('User reviews found:', userReviews.length);
    
    if (userReviews.length === 0) {
      // If user has no reviews, return popular locations
      const popularLocations = await Location.find()
        .sort({ rating: -1 })
        .limit(10);
      
      console.log('No user reviews, returning popular locations:', popularLocations.length);
      
      return res.status(200).json({
        success: true,
        recommendations: popularLocations,
        algorithm: 'popularity-based'
      });
    }
    
    // Calculate user's average rating and preferred location types
    const userAvgRating = userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length;
    const reviewedLocationIds = userReviews.map(review => review.location._id);
    
    console.log('User avg rating:', userAvgRating, 'Reviewed locations:', reviewedLocationIds.length);
    
    // Find users with similar rating patterns (collaborative filtering)
    const similarUsers = await findSimilarUsers(userId, userReviews);
    
    console.log('Similar users found:', similarUsers.length);
    
    // Get locations highly rated by similar users that current user hasn't reviewed
    let recommendations = [];
    
    if (similarUsers.length > 0) {
      const similarUserIds = similarUsers.map(user => user.id);
      
      // Find locations rated 3.5 or higher from similar users that the current user hasn't reviewed
      const similarUserReviews = await Review.find({
        user: { $in: similarUserIds },
        location: { $nin: reviewedLocationIds },
        rating: { $gte: 3.5 } // Only high-rated recommendations
      })
      .populate('location')
      .sort({ rating: -1 });
      
      console.log('Similar user reviews found:', similarUserReviews.length);
      
      // Group by location and calculate average rating from similar users
      const locationRatings = {};
      similarUserReviews.forEach(review => {
        const locationId = review.location._id.toString();
        if (!locationRatings[locationId]) {
          locationRatings[locationId] = {
            location: review.location,
            ratings: [],
            totalRating: 0,
            count: 0
          };
        }
        locationRatings[locationId].ratings.push(review.rating);
        locationRatings[locationId].totalRating += review.rating;
        locationRatings[locationId].count += 1;
      });
      
      // Sort by average rating from similar users
      recommendations = Object.values(locationRatings)
        .map(item => ({
          location: item.location,
          avgRatingFromSimilarUsers: item.totalRating / item.count,
          reviewCount: item.count
        }))
        .sort((a, b) => b.avgRatingFromSimilarUsers - a.avgRatingFromSimilarUsers)
        .slice(0, 10)
        .map(item => item.location);
    }
    
    console.log('Collaborative recommendations:', recommendations.length);
    
    // If not enough collaborative recommendations, add popular locations with 3.5+ average rating
    if (recommendations.length < 5) {
      const popularLocations = await Location.find({
        _id: { $nin: [...reviewedLocationIds, ...recommendations.map(r => r._id)] },
        rating: { $gte: 3.5 }
      })
      .sort({ rating: -1 })
      .limit(10 - recommendations.length);
      
      recommendations = [...recommendations, ...popularLocations];
      console.log('After popular locations, total recommendations:', recommendations.length);
    }
    
    console.log('Final recommendations count:', recommendations.length);
    
    res.status(200).json({
      success: true,
      recommendations,
      algorithm: 'hybrid',
      userStats: {
        reviewCount: userReviews.length,
        avgRating: userAvgRating.toFixed(1)
      }
    });
    
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating recommendations',
      error: error.message 
    });
  }
};

// Helper function to find users with similar rating patterns
async function findSimilarUsers(userId, userReviews) {
  try {
    // Get all users who have reviewed the same locations
    const reviewedLocationIds = userReviews.map(review => review.location._id);
    
    const otherUserReviews = await Review.find({
      user: { $ne: userId },
      location: { $in: reviewedLocationIds }
    }).populate('user');
    
    // Group reviews by user
    const userRatings = {};
    otherUserReviews.forEach(review => {
      const otherUserId = review.user._id.toString();
      if (!userRatings[otherUserId]) {
        userRatings[otherUserId] = [];
      }
      userRatings[otherUserId].push({
        locationId: review.location.toString(),
        rating: review.rating
      });
    });
    
    // Calculate similarity scores using Pearson correlation
    const similarities = [];
    
    Object.keys(userRatings).forEach(otherUserId => {
      const otherRatings = userRatings[otherUserId];
      const similarity = calculatePearsonCorrelation(userReviews, otherRatings);
      
      if (similarity > 0.3) { // Threshold for similarity
        similarities.push({
          id: otherUserId,
          similarity: similarity
        });
      }
    });
    
    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
    
  } catch (error) {
    console.error('Error finding similar users:', error);
    return [];
  }
}

// Helper function to calculate Pearson correlation coefficient
function calculatePearsonCorrelation(userReviews, otherUserRatings) {
  // Find common locations
  const userRatingMap = {};
  userReviews.forEach(review => {
    userRatingMap[review.location._id.toString()] = review.rating;
  });
  
  const otherRatingMap = {};
  otherUserRatings.forEach(rating => {
    otherRatingMap[rating.locationId] = rating.rating;
  });
  
  const commonLocations = Object.keys(userRatingMap).filter(
    locationId => otherRatingMap[locationId] !== undefined
  );
  
  if (commonLocations.length < 2) return 0;
  
  // Calculate Pearson correlation
  const n = commonLocations.length;
  let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
  
  commonLocations.forEach(locationId => {
    const rating1 = userRatingMap[locationId];
    const rating2 = otherRatingMap[locationId];
    
    sum1 += rating1;
    sum2 += rating2;
    sum1Sq += rating1 * rating1;
    sum2Sq += rating2 * rating2;
    pSum += rating1 * rating2;
  });
  
  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  return den === 0 ? 0 : num / den;
}