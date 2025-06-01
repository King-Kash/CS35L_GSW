import { Router } from 'express';
import { pinLocation, unpinLocation, getPinnedLocations, checkIfPinned } from '../controllers/pins.js';
import { checkAuthenticated } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(checkAuthenticated);

// Pin a location
router.post('/pin/:locationId', pinLocation);

// Unpin a location
router.delete('/unpin/:locationId', unpinLocation);

// Get all pinned locations for the authenticated user
router.get('/my-pins', getPinnedLocations);

// Check if a specific location is pinned
router.get('/check/:locationId', checkIfPinned);

export default router; 