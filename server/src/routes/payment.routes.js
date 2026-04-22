import express from "express";
import { createOrder, verifyPayment, refundPayment } from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/role.middleware.js";

const router = express.Router();
router.use(protect);

router.post("/create-order", restrictTo("passenger"), createOrder);
router.post("/verify", restrictTo("passenger"), verifyPayment);
router.post("/refund", restrictTo("passenger"), refundPayment);

export default router;