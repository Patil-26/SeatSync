import express from "express";
import {
    getDashboardStats,
    getAllUsers,
    deactivateUser,
    activateUser,
    verifyDriver,
    getAllRides,
    getPopularRoutes,
    getDemandPattern,
    getGrowthAnalytics,
    getSuspiciousUsers,
    adjustTrustScore,
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/role.middleware.js";

const router = express.Router();

// all admin routes require login + admin role
router.use(protect);
router.use(restrictTo("admin"));

// dashboard
router.get("/dashboard", getDashboardStats);

// user management
router.get("/users", getAllUsers);
router.put("/users/:id/deactivate", deactivateUser);
router.put("/users/:id/activate", activateUser);
router.put("/users/:id/trust-score", adjustTrustScore);

// driver verification
router.put("/drivers/:id/verify", verifyDriver);

// ride monitoring
router.get("/rides", getAllRides);

// analytics
router.get("/analytics/popular-routes", getPopularRoutes);
router.get("/analytics/demand-pattern", getDemandPattern);
router.get("/analytics/growth", getGrowthAnalytics);

// fraud detection
router.get("/fraud/suspicious-users", getSuspiciousUsers);

export default router;
