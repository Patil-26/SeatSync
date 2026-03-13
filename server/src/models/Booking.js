import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        ride: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ride",
            required: true,
        },
        passenger: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        seatsBooked: {
            type: Number,
            required: true,
            min: 1,
            max: 6,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
            default: "pending",
        },
        // pickup and dropoff within the ride route
        pickupPoint: {
            name: { type: String, default: "" },
        },
        dropoffPoint: {
            name: { type: String, default: "" },
        },
        // payment
        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid", "refunded"],
            default: "unpaid",
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "online"],
            default: "cash",
        },
        // ratings
        passengerRating: {
            rating: { type: Number, min: 1, max: 5, default: null },
            review: { type: String, default: "" },
            givenAt: { type: Date, default: null },
        },
        driverRating: {
            rating: { type: Number, min: 1, max: 5, default: null },
            review: { type: String, default: "" },
            givenAt: { type: Date, default: null },
        },
        cancellationReason: { type: String, default: "" },
        cancelledBy: {
            type: String,
            enum: ["passenger", "driver", null],
            default: null,
        },
    },
    { timestamps: true }
);

// one passenger cannot book the same ride twice
bookingSchema.index({ ride: 1, passenger: 1 }, { unique: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
