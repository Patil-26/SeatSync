import express from "express";
import {
  updateProfile,
  driverOnboarding,
  getDriverProfile,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

router.put("/update-profile", updateProfile);
router.put("/driver/onboarding", restrictTo("driver"), driverOnboarding);
router.get("/driver/profile", restrictTo("driver"), getDriverProfile);

export default router;
