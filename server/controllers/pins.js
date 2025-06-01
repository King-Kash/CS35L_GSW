import User from "../models/user_model.js";
import Location from "../models/location_model.js";

// Pin a location for the authenticated user
export const pinLocation = async (req, res) => {
    try {
        const { locationId } = req.params;
        const userId = req.user.id;

        // Check if location exists
        const location = await Location.findById(locationId);
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        // Find the user and check if location is already pinned
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if location is already pinned
        const isAlreadyPinned = user.pinnedLocations.some(
            pin => pin.location.toString() === locationId
        );

        if (isAlreadyPinned) {
            return res.status(400).json({ message: "Location already pinned" });
        }

        // Add location to pinned locations
        user.pinnedLocations.push({
            location: locationId,
            pinnedAt: new Date()
        });

        await User.updateOne(
            { _id: userId },
            { $push: { pinnedLocations: { location: locationId, pinnedAt: new Date() } } }
        );

        res.status(200).json({ 
            message: "Location pinned successfully",
            pinnedLocation: {
                locationId,
                pinnedAt: new Date()
            }
        });
    } catch (error) {
        console.error("Error pinning location:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Unpin a location for the authenticated user
export const unpinLocation = async (req, res) => {
    try {
        const { locationId } = req.params;
        const userId = req.user.id;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove location from pinned locations
        const initialLength = user.pinnedLocations.length;
        user.pinnedLocations = user.pinnedLocations.filter(
            pin => pin.location.toString() !== locationId
        );

        if (user.pinnedLocations.length === initialLength) {
            return res.status(404).json({ message: "Location not found in pinned locations" });
        }

        await User.updateOne(
            { _id: userId },
            { $pull: { pinnedLocations: { location: locationId } } }
        );

        res.status(200).json({ message: "Location unpinned successfully" });
    } catch (error) {
        console.error("Error unpinning location:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all pinned locations for the authenticated user
export const getPinnedLocations = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId)
            .populate({
                path: 'pinnedLocations.location',
                model: 'Location'
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Filter out any null locations (in case of deleted locations)
        const validPinnedLocations = user.pinnedLocations.filter(pin => pin.location);

        res.status(200).json({
            pinnedLocations: validPinnedLocations
        });
    } catch (error) {
        console.error("Error getting pinned locations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Check if a specific location is pinned by the authenticated user
export const checkIfPinned = async (req, res) => {
    try {
        const { locationId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPinned = user.pinnedLocations.some(
            pin => pin.location.toString() === locationId
        );

        res.status(200).json({ isPinned });
    } catch (error) {
        console.error("Error checking pin status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}; 