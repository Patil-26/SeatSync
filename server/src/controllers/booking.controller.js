import Booking from "../models/Booking.js";
import Ride from "../models/Ride.js";
import User from "../models/User.js";
import { sendMail, bookingRequestEmail, bookingAcceptedEmail, bookingRejectedEmail } from "../config/mailer.js";

// @POST /api/bookings/create
export const createBooking = async (req, res) => {
  try {
    const { rideId, seatsBooked, pickupPoint, dropoffPoint, paymentMethod } = req.body;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ success: false, message: "Ride not found." });
    if (ride.status !== "scheduled") return res.status(400).json({ success: false, message: "This ride is no longer available for booking." });
    if (ride.driver.toString() === req.user._id.toString()) return res.status(400).json({ success: false, message: "You cannot book your own ride." });
    if (ride.availableSeats < seatsBooked) return res.status(400).json({ success: false, message: `Only ${ride.availableSeats} seat(s) available.` });
    const alreadyBooked = await Booking.findOne({ ride: rideId, passenger: req.user._id });
    if (alreadyBooked) return res.status(400).json({ success: false, message: "You have already booked this ride." });
    const totalPrice = ride.pricePerSeat * seatsBooked;
    const booking = await Booking.create({
      ride: rideId,
      passenger: req.user._id,
      driver: ride.driver,
      seatsBooked,
      totalPrice,
      pickupPoint: pickupPoint || { name: ride.source.name },
      dropoffPoint: dropoffPoint || { name: ride.destination.name },
      paymentMethod: paymentMethod || "cash",
    });
    ride.availableSeats -= seatsBooked;
    ride.bookings.push(booking._id);
    await ride.save();
    const passenger = await User.findById(req.user._id);
    const emailTemplate = bookingRequestEmail(passenger.name, ride);
    await sendMail({ to: passenger.email, ...emailTemplate });
    res.status(201).json({ success: true, message: "Booking request sent. Waiting for driver confirmation.", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/bookings/:id/accept
export const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    if (booking.driver.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: "You can only accept bookings for your own rides." });
    if (booking.status !== "pending") return res.status(400).json({ success: false, message: `Booking is already ${booking.status}.` });
    booking.status = "accepted";
    await booking.save();
    const ride = await Ride.findById(booking.ride);
    const passenger = await User.findById(booking.passenger);
    const emailTemplate = bookingAcceptedEmail(passenger.name, ride);
    await sendMail({ to: passenger.email, ...emailTemplate });
    res.status(200).json({ success: true, message: "Booking accepted.", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/bookings/:id/reject
export const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("ride");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    if (booking.driver.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: "You can only reject bookings for your own rides." });
    if (booking.status !== "pending") return res.status(400).json({ success: false, message: `Booking is already ${booking.status}.` });
    booking.status = "rejected";
    await booking.save();
    await Ride.findByIdAndUpdate(booking.ride._id, { $inc: { availableSeats: booking.seatsBooked } });
    const ride = await Ride.findById(booking.ride._id);
    const passenger = await User.findById(booking.passenger);
    const emailTemplate = bookingRejectedEmail(passenger.name, ride);
    await sendMail({ to: passenger.email, ...emailTemplate });
    res.status(200).json({ success: true, message: "Booking rejected.", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    if (booking.passenger.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: "You can only cancel your own bookings." });
    if (booking.status === "completed" || booking.status === "cancelled") return res.status(400).json({ success: false, message: `Booking is already ${booking.status}.` });
    const previousStatus = booking.status;
    booking.status = "cancelled";
    booking.cancelledBy = "passenger";
    booking.cancellationReason = req.body.reason || "";
    await booking.save();
    if (previousStatus === "pending" || previousStatus === "accepted") {
      await Ride.findByIdAndUpdate(booking.ride, { $inc: { availableSeats: booking.seatsBooked } });
    }
    res.status(200).json({ success: true, message: "Booking cancelled.", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/bookings/my-bookings
export const getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { passenger: req.user._id };
    if (status) filter.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const bookings = await Booking.find(filter)
      .populate("ride", "source destination departureTime pricePerSeat status vehicle")
      .populate("driver", "name avatar averageRating trustScore")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Booking.countDocuments(filter);
    res.status(200).json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/bookings/ride/:rideId
export const getBookingsForRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) return res.status(404).json({ success: false, message: "Ride not found." });
    if (ride.driver.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: "Access denied." });
    const bookings = await Booking.find({ ride: req.params.rideId })
      .populate("passenger", "name avatar phone averageRating trustScore")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/bookings/:id/rate-driver
export const rateDriver = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    if (booking.passenger.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: "Access denied." });
    if (booking.status !== "completed") return res.status(400).json({ success: false, message: "You can only rate after the ride is completed." });
    if (booking.passengerRating.rating) return res.status(400).json({ success: false, message: "You have already rated this ride." });
    booking.passengerRating = { rating, review: review || "", givenAt: new Date() };
    await booking.save();
    const driver = await User.findById(booking.driver);
    const newTotal = driver.totalRatings + 1;
    const newAverage = (driver.averageRating * driver.totalRatings + rating) / newTotal;
    driver.totalRatings = newTotal;
    driver.averageRating = parseFloat(newAverage.toFixed(2));
    await driver.save();
    res.status(200).json({ success: true, message: "Driver rated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/bookings/:id/rate-passenger
export const ratePassenger = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    if (booking.driver.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: "Access denied." });
    if (booking.status !== "completed") return res.status(400).json({ success: false, message: "You can only rate after the ride is completed." });
    if (booking.driverRating.rating) return res.status(400).json({ success: false, message: "You have already rated this passenger." });
    booking.driverRating = { rating, review: review || "", givenAt: new Date() };
    await booking.save();
    const passenger = await User.findById(booking.passenger);
    const newTotal = passenger.totalRatings + 1;
    const newAverage = (passenger.averageRating * passenger.totalRatings + rating) / newTotal;
    passenger.totalRatings = newTotal;
    passenger.averageRating = parseFloat(newAverage.toFixed(2));
    await passenger.save();
    res.status(200).json({ success: true, message: "Passenger rated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};