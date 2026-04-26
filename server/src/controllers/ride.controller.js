import Ride from "../models/Ride.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import DriverProfile from "../models/DriverProfile.js";
import { calculateTrustScore } from "../utils/trustScore.js";
import { sendMail } from "../config/mailer.js";

// @POST /api/rides/create
export const createRide = async (req, res) => {
  try {
    const {
      sourceName, sourceAddress, sourceLng, sourceLat,
      destinationName, destinationAddress, destinationLng, destinationLat,
      departureTime, estimatedArrivalTime, totalSeats, pricePerSeat,
      distanceKm, preferences, description, vehicle,
    } = req.body;

    const driverProfile = await DriverProfile.findOne({ userId: req.user._id });
    if (!driverProfile || driverProfile.verificationStatus !== "verified") {
      return res.status(403).json({ success: false, message: "Your driver profile must be verified before posting a ride." });
    }

    const co2SavedPerPassenger = distanceKm
      ? parseFloat(((0.21 * distanceKm) / totalSeats).toFixed(2))
      : 0;

    const ride = await Ride.create({
      driver: req.user._id,
      source: {
        name: sourceName,
        address: sourceAddress || "",
        coordinates: { type: "Point", coordinates: [parseFloat(sourceLng), parseFloat(sourceLat)] },
      },
      destination: {
        name: destinationName,
        address: destinationAddress || "",
        coordinates: { type: "Point", coordinates: [parseFloat(destinationLng), parseFloat(destinationLat)] },
      },
      departureTime,
      estimatedArrivalTime: estimatedArrivalTime || null,
      totalSeats: parseInt(totalSeats),
      availableSeats: parseInt(totalSeats),
      pricePerSeat: parseFloat(pricePerSeat),
      distanceKm: parseFloat(distanceKm) || 0,
      preferences: preferences || {},
      description: description || "",
      vehicle: vehicle || driverProfile.vehicle,
      co2SavedPerPassenger,
    });

    res.status(201).json({ success: true, message: "Ride created successfully.", ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/rides/search
export const searchRides = async (req, res) => {
  try {
    const {
      sourceName, destinationName,
      sourceLat, sourceLng, destinationLat, destinationLng,
      date, seats, minPrice, maxPrice,
      page = 1, limit = 10,
    } = req.query;

    const filter = { status: "scheduled" };

    if (sourceName && !sourceLat) filter["source.name"] = { $regex: sourceName, $options: "i" };
    if (destinationName && !destinationLat) filter["destination.name"] = { $regex: destinationName, $options: "i" };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.departureTime = { $gte: startOfDay, $lte: endOfDay };
    } else {
      filter.departureTime = { $gte: new Date() };
    }

    if (seats) filter.availableSeats = { $gte: parseInt(seats) };
    if (minPrice || maxPrice) {
      filter.pricePerSeat = {};
      if (minPrice) filter.pricePerSeat.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerSeat.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    let rides = await Ride.find(filter)
      .populate("driver", "name avatar averageRating totalRidesAsDriver trustScore isPro")
      .sort({ departureTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    if (sourceLat && sourceLng && destinationLat && destinationLng) {
      const { isRouteMatch } = await import("../utils/routeMatching.js");
      rides = rides.filter((ride) => {
        const [rideSrcLng, rideSrcLat] = ride.source.coordinates.coordinates;
        const [rideDestLng, rideDestLat] = ride.destination.coordinates.coordinates;
        const { isMatch } = isRouteMatch(
          parseFloat(sourceLat), parseFloat(sourceLng),
          parseFloat(destinationLat), parseFloat(destinationLng),
          rideSrcLat, rideSrcLng,
          rideDestLat, rideDestLng,
          30
        );
        return isMatch;
      });

      // pro drivers appear first
      rides.sort((a, b) => {
        if (a.driver?.isPro && !b.driver?.isPro) return -1;
        if (!a.driver?.isPro && b.driver?.isPro) return 1;
        return 0;
      });
    }

    res.status(200).json({
      success: true,
      total: rides.length,
      page: parseInt(page),
      pages: Math.ceil(rides.length / parseInt(limit)),
      rides,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/rides/:id
export const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate(
      "driver", "name avatar averageRating totalRidesAsDriver trustScore phone isPro"
    );
    if (!ride) return res.status(404).json({ success: false, message: "Ride not found." });
    res.status(200).json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/rides/driver/my-rides
export const getMyRides = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { driver: req.user._id };
    if (status) filter.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const rides = await Ride.find(filter)
      .sort({ departureTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Ride.countDocuments(filter);
    res.status(200).json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), rides });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/rides/:id/cancel
export const cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ success: false, message: "Ride not found." });

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only cancel your own rides." });
    }

    if (ride.status === "completed" || ride.status === "cancelled") {
      return res.status(400).json({ success: false, message: `Ride is already ${ride.status}.` });
    }

    // ── cancellation window check ──
    const driver = await User.findById(req.user._id);
    const hoursUntilDeparture = (new Date(ride.departureTime) - new Date()) / (1000 * 60 * 60);
    const windowHours = driver.isPro ? 12 : 30;

    if (hoursUntilDeparture < windowHours && hoursUntilDeparture > 0) {
      return res.status(400).json({
        success: false,
        message: `You cannot cancel a ride within ${windowHours} hours of departure.${!driver.isPro ? " Upgrade to Pro to get a smaller cancellation window." : ""}`,
      });
    }

    // ── cancel all active bookings + refund ──
    const activeBookings = await Booking.find({
      ride: ride._id,
      status: { $in: ["pending", "accepted"] },
    }).populate("passenger", "name email");

    for (const booking of activeBookings) {
      booking.status = "cancelled";
      booking.cancelledBy = "driver";
      booking.cancellationReason = "Driver cancelled the ride";

      // auto refund if paid
      if (booking.paymentStatus === "paid") {
        booking.paymentStatus = "refunded";
      }

      await booking.save();

      // restore seats
      ride.availableSeats += booking.seatsBooked;

      // notify passenger via email
      if (booking.passenger?.email) {
        await sendMail({
          to: booking.passenger.email,
          subject: "Ride Cancelled — SeatSync",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto">
              <h2 style="background:#ffe156;padding:12px;border:2px solid #1a1a1a;display:inline-block">SEATSYNC</h2>
              <h3>Hey ${booking.passenger.name},</h3>
              <p>Unfortunately the driver cancelled the ride <strong>${ride.source.name} → ${ride.destination.name}</strong> on ${new Date(ride.departureTime).toLocaleString("en-IN")}.</p>
              ${booking.paymentStatus === "refunded" ? "<p><strong style='color:green'>✓ Your payment has been refunded.</strong></p>" : ""}
              <p>We're sorry for the inconvenience. Please search for another ride!</p>
              <p style="color:#888;font-size:12px">— The SeatSync Team</p>
            </div>
          `,
        });
      }
    }

    // ── deduct trust score ──
    driver.trustScore = calculateTrustScore(driver.trustScore, "ride_cancelled_by_driver");
    await driver.save();

    ride.status = "cancelled";
    await ride.save();

    res.status(200).json({
      success: true,
      message: "Ride cancelled. All passengers have been notified and refunded.",
      ride,
      affectedBookings: activeBookings.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/rides/:id/update
export const updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ success: false, message: "Ride not found." });
    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only update your own rides." });
    }
    if (ride.status !== "scheduled") {
      return res.status(400).json({ success: false, message: "Only scheduled rides can be updated." });
    }
    const allowedFields = ["pricePerSeat", "departureTime", "estimatedArrivalTime", "preferences", "description"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) ride[field] = req.body[field];
    });
    await ride.save();
    res.status(200).json({ success: true, message: "Ride updated.", ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};