import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import useToastStore from "../../store/useToastStore.js";
import api from "../../api/axios.js";

const statusBadge = { scheduled: "badge-green", ongoing: "badge-yellow", completed: "badge-gray", cancelled: "badge-red" };

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        className="text-2xl"
        style={{ color: s <= value ? "#ffe156" : "#ccc", textShadow: s <= value ? "1px 1px 0 #1a1a1a" : "none" }}
      >
        ★
      </button>
    ))}
  </div>
);

const RateModal = ({ booking, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);
    await onSubmit(booking._id, rating, review);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="card w-full max-w-sm mx-4" style={{ background: "#fffef5" }}>
        <h2 className="font-black text-xl uppercase mb-1">Rate Passenger</h2>
        <p className="text-sm text-gray-500 mb-4">
          How was <span className="font-bold">{booking.passenger?.name}</span> as a passenger?
        </p>
        <div className="mb-4">
          <p className="text-sm font-black uppercase tracking-wider mb-2">Your Rating</p>
          <StarRating value={rating} onChange={setRating} />
        </div>
        <div className="mb-4">
          <p className="text-sm font-black uppercase tracking-wider mb-1">Review (optional)</p>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="input-field w-full"
            rows={3}
            placeholder="Share your experience..."
          />
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSubmit} disabled={!rating || loading} className="btn-primary flex-1">
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

const MyRides = () => {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRide, setExpandedRide] = useState(null);
  const [bookings, setBookings] = useState({});
  const [loadingBookings, setLoadingBookings] = useState(null);
  const [ratingBooking, setRatingBooking] = useState(null);

  useEffect(() => {
    api.get("/rides/driver/my-rides").then((res) => {
      setRides(res.data.rides);
      setLoading(false);
    });
  }, []);

  const cancelRide = async (id) => {
    try {
      await api.put(`/rides/${id}/cancel`);
      setRides((prev) => prev.map((r) => (r._id === id ? { ...r, status: "cancelled" } : r)));
      addToast("Ride cancelled", "info");
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to cancel", "error");
    }
  };

  const togglePassengers = async (rideId) => {
    if (expandedRide === rideId) { setExpandedRide(null); return; }
    setExpandedRide(rideId);
    if (bookings[rideId]) return;
    setLoadingBookings(rideId);
    try {
      const res = await api.get(`/bookings/ride/${rideId}`);
      setBookings((prev) => ({ ...prev, [rideId]: res.data.bookings }));
    } catch {
      addToast("Failed to load passengers", "error");
    } finally {
      setLoadingBookings(null);
    }
  };

  const submitRating = async (bookingId, rating, review) => {
    try {
      await api.put(`/bookings/${bookingId}/rate-passenger`, { rating, review });
      // update local bookings state
      setBookings((prev) => {
        const updated = { ...prev };
        for (const rideId in updated) {
          updated[rideId] = updated[rideId].map((b) =>
            b._id === bookingId
              ? { ...b, driverRating: { rating, review, givenAt: new Date() } }
              : b
          );
        }
        return updated;
      });
      addToast("Passenger rated successfully!", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Rating failed", "error");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen" style={{ background: "#fffef5" }}>
      <Navbar />
      {ratingBooking && (
        <RateModal
          booking={ratingBooking}
          onClose={() => setRatingBooking(null)}
          onSubmit={submitRating}
        />
      )}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8 animate-fade-up">
          <div>
            <div className="badge badge-yellow inline-block mb-2">Driver</div>
            <h1 className="text-3xl font-black">MY RIDES</h1>
            <p className="text-sm text-gray-500 mt-0.5">{rides.length} ride{rides.length !== 1 ? "s" : ""} posted</p>
          </div>
          <button onClick={() => navigate("/post-ride")} className="btn-primary">+ Post Ride</button>
        </div>

        {rides.length === 0 ? (
          <div className="card text-center py-16 animate-fade-up">
            <p className="text-4xl font-black mb-2" style={{ opacity: 0.1 }}>00</p>
            <p className="font-black text-lg">NO RIDES POSTED YET</p>
            <p className="text-sm text-gray-500 mt-1 mb-4">Start by posting your first ride and earn money on your commute.</p>
            <button onClick={() => navigate("/post-ride")} className="btn-primary">Post First Ride</button>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride, i) => (
              <div key={ride._id} className="card animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <p className="font-black text-lg">{ride.source.name} &rarr; {ride.destination.name}</p>
                      <span className={`badge ${statusBadge[ride.status] || "badge-gray"}`}>{ride.status}</span>
                    </div>
                    <p className="text-sm text-gray-500">{new Date(ride.departureTime).toLocaleString("en-IN")}</p>
                    <p className="text-sm text-gray-600 mt-1 font-bold">{ride.availableSeats}/{ride.totalSeats} seats / INR {ride.pricePerSeat} per seat</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {ride.status === "scheduled" && (
                      <button onClick={() => cancelRide(ride._id)} className="btn-danger">Cancel</button>
                    )}
                    {(ride.status === "completed" || ride.status === "ongoing") && (
                      <button
                        onClick={() => togglePassengers(ride._id)}
                        className="btn-secondary text-sm"
                      >
                        {expandedRide === ride._id ? "Hide" : "Passengers"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Passengers list */}
                {expandedRide === ride._id && (
                  <div className="mt-4 pt-4" style={{ borderTop: "2px solid #1a1a1a" }}>
                    {loadingBookings === ride._id ? (
                      <p className="text-sm text-gray-500">Loading...</p>
                    ) : bookings[ride._id]?.length === 0 ? (
                      <p className="text-sm text-gray-500">No bookings for this ride.</p>
                    ) : (
                      <div className="space-y-3">
                        {bookings[ride._id]?.map((b) => (
                          <div key={b._id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 flex items-center justify-center text-xs font-black"
                                style={{ background: "#ffe156", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}>
                                {b.passenger?.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold">{b.passenger?.name}</p>
                                <p className="text-xs text-gray-500">{b.seatsBooked} seat(s) · {b.status}</p>
                              </div>
                            </div>
                            {ride.status === "completed" && b.status === "completed" && !b.driverRating?.rating && (
                              <button
                                onClick={() => setRatingBooking(b)}
                                className="btn-primary text-sm"
                              >
                                ★ Rate
                              </button>
                            )}
                            {b.driverRating?.rating && (
                              <span className="text-sm font-bold" style={{ color: "#ffe156" }}>
                                {"★".repeat(b.driverRating.rating)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRides;