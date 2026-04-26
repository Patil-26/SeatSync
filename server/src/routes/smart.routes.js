import express from "express";
import {
  getPriceSuggestion,
  getMatchedRides,
  getCarbonStats,
  getTrustProfile,
  getSuggestionsForPassenger,
} from "../controllers/smart.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// public
router.get("/route-match", getMatchedRides);
router.get("/trust-profile/:userId", getTrustProfile);

// requires login
router.get("/price-suggestion", protect, getPriceSuggestion);
router.get("/carbon-stats", protect, getCarbonStats);
router.get("/suggestions", protect, getSuggestionsForPassenger);

export default router;