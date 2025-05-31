import Review from "../models/review_model.js";
import Location from "../models/location_model.js";
import mongoose from "mongoose";

// Get all reviews with optional filtering
export const getReviews = async (req, res) => {
  try {
    const { minRating, location, dateFilter } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Apply rating filter
    if (minRating) {
      filter.rating = { $gte: parseInt(minRating) };
    }
    
    // Apply location filter
    if (location) {
      // First try to find the location by name
      const locationDoc = await Location.findOne({ name: location });
      if (locationDoc) {
        filter.location = locationDoc._id;
      } else {
        // If it's a valid ObjectId, try direct search
        if (mongoose.Types.ObjectId.isValid(location)) {
          filter.location = location;
        }
      }
    }
    
    // Apply date filter
    if (dateFilter) {
      const now = new Date();
      let dateLimit;
      
      switch (dateFilter) {
        case 'week':
          dateLimit = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          dateLimit = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case '3months':
          dateLimit = new Date(now.setMonth(now.getMonth() - 3));
          break;
        default:
          // No date filter if value is not recognized
          break;
      }
      
      if (dateLimit) {
        filter.createdAt = { $gte: dateLimit };
      }
    }
    
    // Fetch reviews with populated user and location fields
    const reviews = await Review.find(filter)
      .populate('user', 'username') // Populate user info
      .populate('location', 'name') // Populate location info
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


// export const addReview = async (req, res) => {
//     const { location, rating, contents } = req.body;
//     const user = req.user.userId; // Get user ID from authenticated token

//     // Verify that all required fields are present
//     if (!user || !location || !rating || !contents) {
//         return res.status(400).json({ success: false, message: "All fields are required." });
//     }

//     try {
//     // Check if the location exists
//     const parentLocation = await Location.findById(location);
//     if (!parentLocation) {
//         return res.status(404).json({ success: false, message: "Location not found." });
//     }

//     // Create a new review
//     const newReview = new Review({ user, location, rating, contents });
//     await newReview.save();

//     // Add the review to the location's reviews array (if implemented in the Location schema)
//     parentLocation.reviews = parentLocation.reviews || [];
//     parentLocation.reviews.push(newReview._id);
//     await parentLocation.save();

//     res.status(201).json({ success: true, data: newReview });
//     } catch (error) {
//         console.error("Error adding review:", error.message);
//         res.status(500).json({ success: false, message: "Server error." });
//     }

//     // The following code is a simpler version without location/user in the review which works without bugs
//     // Delete once we can verify the above code works
//     // const { rating, contents } = req.body;

//     // // Verify that required fields are present
//     // if (!rating || !contents) {
//     //     return res.status(400).json({ success: false, message: "Rating and contents are required." });
//     // }

//     // try {
//     //     // Create a new review without validating location or user
//     //     const newReview = new Review({
//     //         rating,
//     //         contents,
//     //     });
//     //     await newReview.save();

//     //     res.status(201).json({ success: true, data: newReview });
//     // } catch (error) {
//     //     console.error("Error adding review:", error.message);
//     //     res.status(500).json({ success: false, message: "Server error." });
//     // }
// };

// testing when no authentication
export const addReview = async (req, res) => {
    // Get user ID from request body instead of auth token
    const { user, location, rating, contents } = req.body;
    
    // Verify that all required fields are present
    if (!user || !location || !rating || !contents) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        // Create a new review
        const newReview = new Review({
            user,
            location,
            rating,
            contents
        });
        
        await newReview.save();
        
        // Update location with the new review
        await Location.findByIdAndUpdate(
            location,
            { $push: { reviews: newReview._id } }
        );
        
        res.status(201).json({ success: true, data: newReview });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

export const deleteReview = async (req, res) => {
    const { id } = req.params;
    // TODO: Add authentication checks so that only user who created the review (or admin) can delete it
    // const userId = req.user.id; // Assuming `req.user` is populated by an authentication middleware
    // const isAdmin = req.user.isAdmin; // Assuming `req.user.isAdmin` indicates admin status
  
    try {
      // Find the review by ID
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ success: false, message: "Review not found." });
      }

      // Check if the user is the owner of the review or an admin
    //   if (review.user.toString() !== userId && !isAdmin) {
    //     return res.status(403).json({ success: false, message: "You are not authorized to delete this review." });
    //   }
  
      // Remove the review from the associated location's reviews array
      const location = await Location.findById(review.location);
      if (location) {
        location.reviews = location.reviews.filter((reviewId) => reviewId.toString() !== id);
        await location.save();
      }
  
      // Delete the review
      await Review.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "Review deleted successfully." });
    } catch (error) {
      console.error("Error deleting review:", error.message);
      res.status(500).json({ success: false, message: "Server error." });
    }

    // The following code is a simpler version without location/user in the review which works without bugs
    // Delete once we can verify the above code works
    // const { id } = req.params;

    // try {
    //     // Find the review by ID
    //     const review = await Review.findById(id);
    //     if (!review) {
    //     return res.status(404).json({ success: false, message: "Review not found." });
    //     }

    //     // Skip user and admin validation for now
    //     // Delete the review
    //     await Review.findByIdAndDelete(id);
    //     res.status(200).json({ success: true, message: "Review deleted successfully." });
    // } catch (error) {
    //     console.error("Error deleting review:", error.message);
    //     res.status(500).json({ success: false, message: "Server error." });
    // }
  };
