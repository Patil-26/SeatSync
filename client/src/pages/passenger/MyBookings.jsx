import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import useToastStore from "../../store/useToastStore.js";
import api from "../../api/axios.js";

const statusBadge = { pending: "badge-yellow", accepted: "badge-green", rejected: "badge-red", cancelled: "badge-gray", completed: "badge-blue" };

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
        <h2 className="font-black text-xl uppercase mb-1">Rate Driver</h2>
        <p className="text-sm text-gray-500 mb-4">
          How was your ride with <span className="font-bold">{booking.driver?.name}</span>?
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

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [ratingBooking, setRatingBooking] = useState(null);
  const { addToast } = useToastStore();

  useEffect(() => {
    api.get("/bookings/my-bookings").then((res) => {
      setBookings(res.data.bookings);
      setLoading(false);
    });
  }, []);

  const cancelBooking = async (id) => {
    setCancelling(id);
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)));
      addToast("Booking cancelled", "info");
    } finally { setCancelling(null); }
  };

  const submitRating = async (bookingId, rating, review) => {
    try {
      await api.put(`/bookings/${bookingId}/rate-driver`, { rating, review });
      setBookings((prev) => prev.map((b) =>
        b._id === bookingId
          ? { ...b, passengerRating: { rating, review, givenAt: new Date() } }
          : b
      ));
      addToast("Driver rated successfully!", "success");
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
        <div className="animate-fade-up mb-8">
          <div className="badge badge-blue inline-block mb-2">Passenger</div>
          <h1 className="text-3xl font-black">MY BOOKINGS</h1>
          <p className="text-sm text-gray-500 mt-0.5">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
        </div>
        {bookings.length === 0 ? (
          <div className="card text-center py-16 animate-fade-up">
            <p className="text-4xl font-black mb-2" style={{ opacity: 0.1 }}>00</p>
            <p className="font-black text-lg">NO BOOKINGS YET</p>
            <p className="text-sm text-gray-500 mt-1">Search for rides and book your first seat to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b, i) => (
              <div key={b._id} className="card animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <p className="font-black text-lg">
                        {b.ride?.source?.name} &rarr; {b.ride?.destination?.name}
                      </p>
                      <span className={`badge ${statusBadge[b.status] || "badge-gray"}`}>{b.status}</span>
                    </div>
                    <p className="text-sm text-gray-500">{b.ride?.departureTime ? new Date(b.ride.departureTime).toLocaleString("en-IN") : ""}</p>
                    <p className="text-sm text-gray-600 mt-1 font-bold">{b.seatsBooked} seat{b.seatsBooked > 1 ? "s" : ""} / INR {b.totalPrice} / {b.paymentMethod}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {(b.status === "pending" || b.status === "accepted") && (
                      <button onClick={() => cancelBooking(b._id)} disabled={cancelling === b._id} className="btn-danger">
                        {cancelling === b._id ? "..." : "Cancel"}
                      </button>
                    )}
                    {b.status === "completed" && !b.passengerRating?.rating && (
                      <button onClick={() => setRatingBooking(b)} className="btn-primary text-sm">
                        ★ Rate Driver
                      </button>
                    )}
                    {b.status === "completed" && b.passengerRating?.rating && (
                      <div className="flex items-center gap-1 text-sm font-bold" style={{ color: "#1a1a1a" }}>
                        <span style={{ color: "#ffe156" }}>{"★".repeat(b.passengerRating.rating)}</span>
                        <span>Rated</span>
                      </div>
                    )}
                  </div>
                </div>
                {b.driver && (
                  <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: "2px solid #1a1a1a" }}>
                    <div className="w-7 h-7 flex items-center justify-center text-xs font-black"
                      style={{ background: "#ffe156", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}>
                      {b.driver?.name?.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-bold">{b.driver?.name}</p>
                    {b.driver?.averageRating > 0 && (
                      <span className="text-xs text-gray-500">★ {b.driver.averageRating.toFixed(1)}</span>
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

export default MyBookings;