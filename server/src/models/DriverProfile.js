import mongoose from "mongoose";

const driverProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        vehicle: {
            make: { type: String, default: "" },
            model: { type: String, default: "" },
            color: { type: String, default: "" },
            year: { type: Number, default: null },
            registrationNumber: { type: String, default: "" },
            totalSeats: { type: Number, default: 4, min: 1, max: 7 },
        },
        documents: {
            licenseUrl: { type: String, default: "" },
            rcUrl: { type: String, default: "" },
            insuranceUrl: { type: String, default: "" },
        },
        licenseNumber: { type: String, default: "" },
        licenseExpiry: { type: Date, default: null },
        verificationStatus: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending",
        },
        verificationNote: { type: String, default: "" },
        totalEarnings: { type: Number, default: 0 },
        totalTripsCompleted: { type: Number, default: 0 },
        preferences: {
            smokingAllowed: { type: Boolean, default: false },
            petsAllowed: { type: Boolean, default: false },
            musicAllowed: { type: Boolean, default: true },
            talkative: {
                type: String,
                enum: ["silent", "sometimes", "talkative"],
                default: "sometimes",
            },
        },
    },
    { timestamps: true }
);

const DriverProfile = mongoose.model("DriverProfile", driverProfileSchema);
export default DriverProfile;
