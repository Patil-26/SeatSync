import Booking from "../models/Booking.js";
import Ride from "../models/Ride.js";
import crypto from "crypto";

// @POST /api/payments/create-order
// passenger initiates payment
export const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate("ride");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    if (booking.passenger.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: "Access denied." });
    if (booking.paymentStatus === "paid") return res.status(400).json({ success: false, message: "Already paid." });

    // mock order — in production replace with real Razorpay order
    const mockOrderId = `order_${crypto.randomBytes(8).toString("hex")}`;
    res.status(200).json({
      success: true,
      orderId: mockOrderId,
      amount: booking.totalPrice * 100, // paise
      currency: "INR",
      bookingId: booking._id,
      rideName: `${booking.ride.source.name} → ${booking.ride.destination.name}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/payments/verify
// verify payment and mark booking as paid
export const verifyPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    if (booking.passenger.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: "Access denied." });
    if (booking.paymentStatus === "paid") return res.status(400).json({ success: false, message: "Already paid." });

    booking.paymentStatus = "paid";
    booking.paymentMethod = paymentMethod || "online";
    await booking.save();

    res.status(200).json({ success: true, message: "Payment successful.", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/payments/refund
// refund payment on cancellation
export const refundPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    if (booking.passenger.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: "Access denied." });
    if (booking.paymentStatus !== "paid") return res.status(400).json({ success: false, message: "No payment to refund." });

    booking.paymentStatus = "refunded";
    await booking.save();

    res.status(200).json({ success: true, message: "Refund processed.", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};