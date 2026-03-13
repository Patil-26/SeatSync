import Ride from "../models/Ride.js";
import User from "../models/User.js";
import { getSuggestedPrice } from "../utils/dynamicPricing.js";
import { isRouteMatch } from "../utils/routeMatching.js";
import { getCO2Badge, getEquivalent } from "../utils/carbonTracker.js";
import { getTrustLabel } from "../utils/trustScore.js";

// @GET /api/smart/price-suggestion
// driver calls this before creating a ride
// query: distanceKm, sourceLat, sourceLng, destinationLat, destinationLng, departureTime
export const getPriceSuggestion = async (req, res) => {
  try {
    const {
      distanceKm,
      sourceLat,
      sourceLng,
      destinationLat,
      destinationLng,
      departureTime,
    } = req.query;

    if (!distanceKm || !departureTime) {
      return res.status(400).json({
        success: false,
        message: "distanceKm and departureTime are required.",
      });
    }

    // count how many scheduled rides exist on this route
    const availableRides = await Ride.countDocuments({
      status: "scheduled",
      departureTime: { $gte: new Date(departureTime) },
    });

    // simulate search count using recent bookings as a demand proxy
    const searchCount = availableRides > 0 ? Math.floor(availableRides * 2.5) : 5;

    const suggestion = getSuggestedPrice(
      parseFloat(distanceKm),
      availableRides,
      searchCount,
      new Date(departureTime)
    );

    res.status(200).json({ success: true, suggestion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/smart/route-match
// passenger finds rides matching their source and destination
// within a radius even if city names differ
// query: sourceLat, sourceLng, destLat, destLng, date, seats, radiusKm
export const getMatchedRides = async (req, res) => {
  try {
    const {
      sourceLat,
      sourceLng,
      destLat,
      destLng,
      date,
      seats = 1,
      radiusKm = 30,
    } = req.query;

    if (!sourceLat || !sourceLng || !destLat || !destLng) {
      return res.status(400).json({
        success: false,
        message: "sourceLat, sourceLng, destLat, destLng are required.",
      });
    }

    const filter = {
      status: "scheduled",
      availableSeats: { $gte: parseInt(seats) },
    };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.departureTime = { $gte: start, $lte: end };
    } else {
      filter.departureTime = { $gte: new Date() };
    }

    const allRides = await Ride.find(filter).populate(
      "driver",
      "name avatar averageRating trustScore totalRidesAsDriver"
    );

    // filter by haversine distance
    const matched = allRides
      .map((ride) => {
        const [rideSrcLng, rideSrcLat] =
          ride.source.coordinates.coordinates;
        const [rideDestLng, rideDestLat] =
          ride.destination.coordinates.coordinates;

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
      rides: matched.map((r) => ({
        ...r.ride.toObject(),
        sourceDistance: r.sourceDistance,
        destDistance: r.destDistance,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/smart/carbon-stats
// get logged-in user's CO2 savings and badge
export const getCarbonStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const badge = getCO2Badge(user.totalCO2Saved);
    const equivalent = getEquivalent(user.totalCO2Saved);
    const trustLabel = getTrustLabel(user.trustScore);

    res.status(200).json({
      success: true,
      stats: {
        totalCO2Saved: user.totalCO2Saved,
        badge,
        equivalent,
        trustScore: user.trustScore,
        trustLabel,
        averageRating: user.averageRating,
        totalRatings: user.totalRatings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/smart/trust-profile/:userId
// get any user's public trust profile
export const getTrustProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "name avatar trustScore averageRating totalRatings totalRidesAsDriver totalRidesAsPassenger totalCO2Saved role"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const trustLabel = getTrustLabel(user.trustScore);
    const badge = getCO2Badge(user.totalCO2Saved);
    const equivalent = getEquivalent(user.totalCO2Saved);

    res.status(200).json({
      success: true,
      profile: {
        ...user.toObject(),
        trustLabel,
        co2Badge: badge,
        co2Equivalent: equivalent,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
