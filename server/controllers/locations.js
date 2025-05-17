import express from "express";
import Location from "../models/location_model.js";

const router = express.Router();

// Controller function to create a new location
const createLocation = async (req, res) => {
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

// Route to handle POST /locations
router.post("/createLocation", createLocation);

export default router