import express from "express";
import { createLocation, modifyLocation, getAllLocations, getLocationTopTags } from "../controllers/locations.js";

const router = express.Router();

router.post("/createLocation", createLocation);
router.post("/modifyLocation/:id", modifyLocation);
router.get("/all", getAllLocations);
router.get("/:locationId/top-tags", getLocationTopTags);

export default router;