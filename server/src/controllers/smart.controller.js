import Ride from "../models/Ride.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { getSuggestedPrice } from "../utils/dynamicPricing.js";
import { isRouteMatch } from "../utils/routeMatching.js";
import { getCO2Badge, getEquivalent } from "../utils/carbonTracker.js";
import { getTrustLabel } from "../utils/trustScore.js";

// @GET /api/smart/price-suggestion
export const getPriceSuggestion = async (req, res) => {
  try {
    const { distanceKm, departureTime } = req.query;
    if (!distanceKm || !departureTime) {
      return res.status(400).json({ success: false, message: "distanceKm and departureTime are required." });
    }
    const availableRides = await Ride.countDocuments({ status: "scheduled", departureTime: { $gte: new Date(departureTime) } });
    const searchCount = availableRides > 0 ? Math.floor(availableRides * 2.5) : 5;
    const suggestion = getSuggestedPrice(parseFloat(distanceKm), availableRides, searchCount, new Date(departureTime));
    res.status(200).json({ success: true, suggestion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/smart/route-match
export const getMatchedRides = async (req, res) => {
  try {
    const { sourceLat, sourceLng, destLat, destLng, date, seats = 1, radiusKm = 30 } = req.query;
    if (!sourceLat || !sourceLng || !destLat || !destLng) {
      return res.status(400).json({ success: false, message: "sourceLat, sourceLng, destLat, destLng are required." });
    }
    const filter = { status: "scheduled", availableSeats: { $gte: parseInt(seats) } };
    if (date) {
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end = new Date(date); end.setHours(23, 59, 59, 999);
      filter.departureTime = { $gte: start, $lte: end };
    } else {
      filter.departureTime = { $gte: new Date() };
    }
    const allRides = await Ride.find(filter).populate("driver", "name avatar averageRating trustScore totalRidesAsDriver isPro");
    const matched = allRides
      .map((ride) => {
        const [rideSrcLng, rideSrcLat] = ride.source.coordinates.coordinates;
        const [rideDestLng, rideDestLat] = ride.destination.coordinates.coordinates;
        const match = isRouteMatch(
          parseFloat(sourceLat), parseFloat(sourceLng),
          parseFloat(destLat), parseFloat(destLng),
          rideSrcLat, rideSrcLng,
          rideDestLat, rideDestLng,
          parseFloat(radiusKm)
        );
        return { ride, ...match };
      })
      .filter((r) => r.isMatch)
      .sort((a, b) => a.sourceDistance - b.sourceDistance);

    res.status(200).json({
      success: true,
      total: matched.length,
      rides: matched.map((r) => ({ ...r.ride.toObject(), sourceDistance: r.sourceDistance, destDistance: r.destDistance })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/smart/suggestions
// suggests rides based on passenger's booking history
export const getSuggestionsForPassenger = async (req, res) => {
  try {
    // get passenger's last 10 completed bookings
    const pastBookings = await Booking.find({
      passenger: req.user._id,
      status: "completed",
    })
      .populate("ride", "source destination")
      .sort({ createdAt: -1 })
      .limit(10);

    if (pastBookings.length === 0) {
      // no history — return popular upcoming rides
      const popularRides = await Ride.find({ status: "scheduled", departureTime: { $gte: new Date() } })
        .populate("driver", "name avatar averageRating trustScore isPro")
        .sort({ "bookings.length": -1, departureTime: 1 })
        .limit(5);
      return res.status(200).json({ success: true, suggestions: popularRides, reason: "popular" });
    }

    // extract most common destinations from history
    const destCount = {};
    for (const b of pastBookings) {
      const destName = b.ride?.destination?.name;
      if (destName) destCount[destName] = (destCount[destName] || 0) + 1;
    }
    const topDest = Object.entries(destCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name]) => name);

    // find upcoming rides to those destinations
    const suggestions = await Ride.find({
      status: "scheduled",
      departureTime: { $gte: new Date() },
      "destination.name": { $in: topDest.map((d) => new RegExp(d.split(",")[0], "i")) },
    })
      .populate("driver", "name avatar averageRating trustScore isPro")
      .sort({ departureTime: 1 })
      .limit(5);

    res.status(200).json({ success: true, suggestions, reason: "history", topDestinations: topDest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/smart/carbon-stats
export const getCarbonStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const badge = getCO2Badge(user.totalCO2Saved);
    const equivalent = getEquivalent(user.totalCO2Saved);
    const trustLabel = getTrustLabel(user.trustScore);
    res.status(200).json({
      success: true,
      stats: { totalCO2Saved: user.totalCO2Saved, badge, equivalent, trustScore: user.trustScore, trustLabel, averageRating: user.averageRating, totalRatings: user.totalRatings },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/smart/trust-profile/:userId
export const getTrustProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "name avatar trustScore averageRating totalRatings totalRidesAsDriver totalRidesAsPassenger totalCO2Saved role isPro"
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    const trustLabel = getTrustLabel(user.trustScore);
    const badge = getCO2Badge(user.totalCO2Saved);
    const equivalent = getEquivalent(user.totalCO2Saved);
    res.status(200).json({
      success: true,
      profile: { ...user.toObject(), trustLabel, co2Badge: badge, co2Equivalent: equivalent },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};