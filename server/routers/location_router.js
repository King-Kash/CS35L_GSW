import express from "express";
import { createLocation, modifyLocation, getAllLocations } from "../controllers/locations.js";

const router = express.Router();

router.post("/createLocation", createLocation);
router.post("/modifyLocation/:id", modifyLocation);
router.get("/all", getAllLocations);

export default router;