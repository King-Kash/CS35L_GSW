import express from "express";
import Location from "../models/location_model.js";

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