import express from "express";
import Location from "../models/location_model.js";
import Review from "../models/review_model.js";
import mongoose from "mongoose";

// Get top tags for a location
export const getLocationTopTags = async (req, res) => {
  try {
    const { locationId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(locationId)) {
      return res.status(400).json({ success: false, message: "Invalid location ID." });
    }
    
    // Find all reviews for this location
    const reviews = await Review.find({ location: locationId });
    
    if (!reviews.length) {
      return res.status(200).json({ success: true, topTags: [] });
    }
    
    // Count tag occurrences
    const tagCounts = {};
    reviews.forEach(review => {
      if (review.tags && review.tags.length) {
        review.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    // Sort tags by count and get top 3
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag);

    await Location.findByIdAndUpdate(locationId, { tags: topTags });
    
    res.status(200).json({ success: true, topTags });
  } catch (error) {
    console.error("Error fetching top tags:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Controller function to create a new location
export const createLocation = async (req, res) => {
  try {
    const {
      name,
      location, // { type: "Point", coordinates: [lng, lat] }
      rating = 0,
      reviews = [],   // Optional: array of review ObjectIds
      image,
      description
    } = req.body;

    const newLocation = new Location({
      name,
      location,
      rating,
      reviews,
      image,
      description
      // timestamps handled automatically
    });

    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ message: "Failed to create location", error: error.message });
  }
};

// Controller function to modify a location
export const modifyLocation = async (req, res) => {
  try {
    const locationId = req.params.id;  // ID of location to update
    const updateData = req.body;       // New fields to update

    // Find location by ID and update with new data, return the updated doc
    const updatedLocation = await Location.findByIdAndUpdate(
      locationId,
      updateData,
      { new: true, runValidators: true } // return updated doc & validate
    );

    if (!updatedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json(updatedLocation);
  } catch (error) {
    console.error("Error modifying location:", error);
    res.status(500).json({ message: "Failed to modify location", error: error.message });
  }
};

// Controller function to get all locations
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().populate('reviews');
    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Failed to fetch locations", error: error.message });
  }
};