import User from "../models/User.js";
import Ride from "../models/Ride.js";
import Booking from "../models/Booking.js";
import { calculateTrustScore } from "../utils/trustScore.js";

// @GET /api/admin/dashboard
// main stats card data for the admin dashboard
export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalDrivers,
            totalPassengers,
            totalRides,
            activeRides,
            totalBookings,
            pendingBookings,
            completedBookings,
            cancelledBookings,
            pendingDriverVerifications,
        ] = await Promise.all([
            User.countDocuments({ role: { $ne: "admin" } }),
            User.countDocuments({ role: "driver" }),
            User.countDocuments({ role: "passenger" }),
            Ride.countDocuments(),
            Ride.countDocuments({ status: { $in: ["scheduled", "ongoing"] } }),
            Booking.countDocuments(),
            Booking.countDocuments({ status: "pending" }),
            Booking.countDocuments({ status: "completed" }),
            Booking.countDocuments({ status: "cancelled" }),
            User.countDocuments({ role: "driver", isActive: true }),
        ]);

        // total revenue from completed paid bookings
        const revenueResult = await Booking.aggregate([
            { $match: { status: "completed", paymentStatus: "paid" } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // total CO2 saved across all users
        const co2Result = await User.aggregate([
            { $group: { _id: null, total: { $sum: "$totalCO2Saved" } } },
        ]);
        const totalCO2Saved = co2Result[0]?.total || 0;

        // new users in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newUsersThisWeek = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo },
        });

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalDrivers,
                totalPassengers,
                newUsersThisWeek,
                totalRides,
                activeRides,
                totalBookings,
                pendingBookings,
                completedBookings,
                cancelledBookings,
                pendingDriverVerifications,
                totalRevenue,
                totalCO2Saved,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @GET /api/admin/users
// paginated list of all users with filters
export const getAllUsers = async (req, res) => {
    try {
        const {
            role,
            isActive,
            search,
            page = 1,
            limit = 20,
            sortBy = "createdAt",
            order = "desc",
        } = req.query;

        const filter = {};
        if (role) filter.role = role;
        if (isActive !== undefined) filter.isActive = isActive === "true";
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOrder = order === "asc" ? 1 : -1;

        const users = await User.find(filter)
            .select("-password -refreshToken")
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(filter);

        res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            users,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @PUT /api/admin/users/:id/deactivate
// ban or deactivate a user account
export const deactivateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found." });
        }

        if (user.role === "admin") {
            return res
                .status(403)
                .json({ success: false, message: "Cannot deactivate an admin." });
        }

        user.isActive = false;
        await user.save();

        res
            .status(200)
            .json({ success: true, message: "User deactivated.", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @PUT /api/admin/users/:id/activate
export const activateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: true },
            { new: true }
        );

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found." });
        }

        res
            .status(200)
            .json({ success: true, message: "User activated.", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @PUT /api/admin/drivers/:id/verify
// admin verifies or rejects a driver
export const verifyDriver = async (req, res) => {
    try {
        const { status, note } = req.body;

        if (!["verified", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be verified or rejected.",
            });
        }

        const DriverProfile = (await import("../models/DriverProfile.js")).default;

        const profile = await DriverProfile.findOne({
            userId: req.params.id,
        });

        if (!profile) {
            return res
                .status(404)
                .json({ success: false, message: "Driver profile not found." });
        }

        profile.verificationStatus = status;
        profile.verificationNote = note || "";
        await profile.save();

        // update trust score when account gets verified
        if (status === "verified") {
            const user = await User.findById(req.params.id);
            user.trustScore = calculateTrustScore(
                user.trustScore,
                "account_verified"
            );
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: `Driver ${status}.`,
            profile,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @GET /api/admin/rides
// paginated list of all rides
export const getAllRides = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (status) filter.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const rides = await Ride.find(filter)
            .populate("driver", "name email phone trustScore")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Ride.countDocuments(filter);

        res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            rides,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @GET /api/admin/analytics/popular-routes
// top 10 most booked routes
export const getPopularRoutes = async (req, res) => {
    try {
        const routes = await Booking.aggregate([
            { $match: { status: { $in: ["completed", "accepted"] } } },
            {
                $lookup: {
                    from: "rides",
                    localField: "ride",
                    foreignField: "_id",
                    as: "rideData",
                },
            },
            { $unwind: "$rideData" },
            {
                $group: {
                    _id: {
                        source: "$rideData.source.name",
                        destination: "$rideData.destination.name",
                    },
                    totalBookings: { $sum: 1 },
                    totalRevenue: { $sum: "$totalPrice" },
                    avgPrice: { $avg: "$totalPrice" },
                },
            },
            { $sort: { totalBookings: -1 } },
            { $limit: 10 },
            {
                $project: {
                    _id: 0,
                    source: "$_id.source",
                    destination: "$_id.destination",
                    totalBookings: 1,
                    totalRevenue: { $round: ["$totalRevenue", 2] },
                    avgPrice: { $round: ["$avgPrice", 2] },
                },
            },
        ]);

        res.status(200).json({ success: true, routes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @GET /api/admin/analytics/demand-pattern
// bookings grouped by hour of day to find peak travel times
export const getDemandPattern = async (req, res) => {
    try {
        const pattern = await Ride.aggregate([
            { $match: { status: { $in: ["completed", "scheduled", "ongoing"] } } },
            {
                $group: {
                    _id: { $hour: "$departureTime" },
                    totalRides: { $sum: 1 },
                    avgPrice: { $avg: "$pricePerSeat" },
                },
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    hour: "$_id",
                    totalRides: 1,
                    avgPrice: { $round: ["$avgPrice", 2] },
                },
            },
        ]);

        res.status(200).json({ success: true, pattern });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @GET /api/admin/analytics/growth
// new users and rides per day for the last 30 days
export const getGrowthAnalytics = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [userGrowth, rideGrowth] = await Promise.all([
            User.aggregate([
                { $match: { createdAt: { $gte: thirtyDaysAgo } } },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
                { $project: { _id: 0, date: "$_id", newUsers: "$count" } },
            ]),

            Ride.aggregate([
                { $match: { createdAt: { $gte: thirtyDaysAgo } } },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
                { $project: { _id: 0, date: "$_id", newRides: "$count" } },
            ]),
        ]);

        res.status(200).json({ success: true, userGrowth, rideGrowth });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @GET /api/admin/fraud/suspicious-users
// flags users with low trust score, many cancellations, or multiple complaints [web:188]
export const getSuspiciousUsers = async (req, res) => {
    try {
        const suspiciousUsers = await User.find({
            $or: [
                { trustScore: { $lte: 25 } },
                { averageRating: { $lte: 2, $gt: 0 } },
            ],
            isActive: true,
        })
            .select("name email phone role trustScore averageRating totalRatings createdAt")
            .sort({ trustScore: 1 })
            .limit(50);

        // users with high cancellation rate
        const highCancellations = await Booking.aggregate([
            { $match: { status: "cancelled" } },
            { $group: { _id: "$passenger", cancellations: { $sum: 1 } } },
            { $match: { cancellations: { $gte: 5 } } },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            { $match: { "user.isActive": true } },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    name: "$user.name",
                    email: "$user.email",
                    cancellations: 1,
                    trustScore: "$user.trustScore",
                },
            },
            { $sort: { cancellations: -1 } },
            { $limit: 20 },
        ]);

        res.status(200).json({
            success: true,
            lowTrustUsers: suspiciousUsers,
            highCancellationUsers: highCancellations,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @PUT /api/admin/users/:id/trust-score
// admin manually adjusts a user's trust score
export const adjustTrustScore = async (req, res) => {
    try {
        const { score, reason } = req.body;

        if (score < 0 || score > 100) {
            return res.status(400).json({
                success: false,
                message: "Trust score must be between 0 and 100.",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { trustScore: score },
            { new: true }
        );

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found." });
        }

        res.status(200).json({
            success: true,
            message: `Trust score updated to ${score}. Reason: ${reason || "Not provided"}`,
            user,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
