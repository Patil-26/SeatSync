import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import Navbar from "../../components/layout/Navbar.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import useRideStore from "../../store/useRideStore.js";
import useAuthStore from "../../store/useAuthStore.js";
import useToastStore from "../../store/useToastStore.js";
import api from "../../api/axios.js";

const makeIcon = (bg, label) => new L.DivIcon({
  html: `<div style="width:30px;height:30px;background:${bg};color:#1a1a1a;font-weight:900;font-size:13px;display:flex;align-items:center;justify-content:center;border:3px solid #1a1a1a;box-shadow:3px 3px 0 #1a1a1a;">${label}</div>`,
  className: "", iconSize: [30, 30], iconAnchor: [15, 15],
});

const FitBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => { if (points.length >= 2) map.fitBounds(points, { padding: [50, 50] }); }, [map, points]);
  return null;
};

// Payment Modal
const PaymentModal = ({ order, onClose, onSuccess }) => {
  const [step, setStep] = useState("method"); // method | processing | success
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const { addToast } = useToastStore();

  const handlePay = async () => {
    if (method === "upi" && !upiId.includes("@")) {
      addToast("Enter a valid UPI ID (e.g. name@upi)", "error");
      return;
    }
    setStep("processing");
    // simulate payment processing delay
    await new Promise((r) => setTimeout(r, 2000));
    try {
      await api.post("/payments/verify", {
        bookingId: order.bookingId,
        paymentMethod: "online",
      });
      setStep("success");
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (err) {
      addToast(err.response?.data?.message || "Payment failed", "error");
      setStep("method");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-sm mx-4 bg-white" style={{ border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>

        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: "2px solid #1a1a1a", background: "#ffe156" }}>
          <div>
            <p className="font-black uppercase tracking-wider text-sm">Complete Payment</p>
            <p className="text-xs text-gray-600 mt-0.5">{order.rideName}</p>
          </div>
          <button onClick={onClose} className="font-black text-xl leading-none">×</button>
        </div>

        <div className="px-6 py-5">
          {step === "method" && (
            <>
              {/* Amount */}
              <div className="text-center mb-5 py-3" style={{ border: "2px solid #1a1a1a", background: "#fffef5" }}>
                <p className="text-3xl font-black">₹{order.amount / 100}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Total Amount</p>
              </div>

              {/* Payment methods */}
              <p className="text-xs font-black uppercase tracking-wider mb-3">Select Payment Method</p>
              <div className="space-y-2 mb-4">
                {[
                  { id: "upi", label: "UPI / GPay / PhonePe", icon: "📱" },
                  { id: "card", label: "Credit / Debit Card", icon: "💳" },
                  { id: "netbanking", label: "Net Banking", icon: "🏦" },
                ].map((m) => (
                  <div key={m.id} onClick={() => setMethod(m.id)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
                    style={{
                      border: `2px solid ${method === m.id ? "#1a1a1a" : "#ddd"}`,
                      background: method === m.id ? "#fffbea" : "#fff",
                      boxShadow: method === m.id ? "3px 3px 0 #1a1a1a" : "none",
                    }}>
                    <span style={{ fontSize: "20px" }}>{m.icon}</span>
                    <span className="font-bold text-sm">{m.label}</span>
                    {method === m.id && <span className="ml-auto font-black text-green-600">✓</span>}
                  </div>
                ))}
              </div>

              {/* UPI ID input */}
              {method === "upi" && (
                <div className="mb-4">
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="input-field w-full"
                  />
                  <p className="text-xs text-gray-400 mt-1">Works with GPay, PhonePe, Paytm, BHIM</p>
                </div>
              )}

              {(method === "card" || method === "netbanking") && (
                <div className="mb-4 px-4 py-3 text-sm text-gray-500 text-center" style={{ border: "1px dashed #ccc" }}>
                  Redirects to secure payment page
                </div>
              )}

              <button onClick={handlePay} className="btn-primary w-full" style={{ background: "#1a1a1a", color: "#ffe156" }}>
                Pay ₹{order.amount / 100}
              </button>
            </>
          )}

          {step === "processing" && (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-black uppercase tracking-wider">Processing Payment</p>
              <p className="text-sm text-gray-500 mt-1">Please wait...</p>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-8">
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4 text-3xl"
                style={{ background: "#b8f3b0", border: "3px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a" }}>
                ✓
              </div>
              <p className="font-black uppercase tracking-wider">Payment Successful!</p>
              <p className="text-sm text-gray-500 mt-1">Your booking is confirmed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentRide, loading, getRideById } = useRideStore();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const [seats, setSeats] = useState(1);
  const [booking, setBooking] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [booked, setBooked] = useState(false);

  useEffect(() => { getRideById(id); }, [id]);

  const handleBook = async () => {
    if (!user) return navigate("/login");
    setBooking(true);
    try {
      // step 1 — create booking
      const bookingRes = await api.post("/bookings/create", {
        rideId: id,
        seatsBooked: seats,
        paymentMethod: "online",
      });
      const bookingId = bookingRes.data.booking._id;

      // step 2 — create payment order
      const orderRes = await api.post("/payments/create-order", { bookingId });
      setPaymentOrder(orderRes.data);
    } catch (err) {
      addToast(err.response?.data?.message || "Booking failed.", "error");
    } finally {
      setBooking(false);
    }
  };

  const handlePaymentSuccess = () => {
    setBooked(true);
    setPaymentOrder(null);
    addToast("Payment successful! Waiting for driver confirmation.", "success");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!currentRide) return <div className="min-h-screen flex items-center justify-center"><p className="font-black text-gray-400">Ride not found.</p></div>;

  const ride = currentRide;
  const srcCoords = ride.source?.coordinates?.coordinates;
  const destCoords = ride.destination?.coordinates?.coordinates;
  const hasMap = srcCoords && destCoords && srcCoords.length === 2 && destCoords.length === 2;
  const mapPoints = hasMap ? [[srcCoords[1], srcCoords[0]], [destCoords[1], destCoords[0]]] : [];

  return (
    <div className="min-h-screen" style={{ background: "#fffef5" }}>
      <Navbar />

      {paymentOrder && (
        <PaymentModal
          order={paymentOrder}
          onClose={() => setPaymentOrder(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">
        <button onClick={() => navigate(-1)} className="text-sm font-bold uppercase tracking-wider mb-6 block cursor-pointer hover:underline">
          &larr; Back
        </button>

        {hasMap && (
          <div className="mb-5 animate-fade-up" style={{ border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
            <MapContainer center={mapPoints[0]} zoom={9} scrollWheelZoom={false} dragging={false} zoomControl={false} attributionControl={false}
              style={{ height: "280px", width: "100%", border: "none", boxShadow: "none" }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              <FitBounds points={mapPoints} />
              <Polyline positions={mapPoints} pathOptions={{ color: "#1a1a1a", weight: 3, dashArray: "10 8" }} />
              <Marker position={mapPoints[0]} icon={makeIcon("#b8f3b0", "A")} />
              <Marker position={mapPoints[1]} icon={makeIcon("#ff6b6b", "B")} />
            </MapContainer>
          </div>
        )}

        <div className="card mb-4 animate-fade-up-delay">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-3xl font-black">{ride.source.name} &rarr; {ride.destination.name}</p>
              <p className="text-sm text-gray-500 mt-1">{ride.source.address} to {ride.destination.address}</p>
              <p className="text-gray-500 mt-2 text-sm">{new Date(ride.departureTime).toLocaleString("en-IN")}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black">&#8377;{ride.pricePerSeat}</p>
              <p className="text-xs uppercase tracking-wider font-bold text-gray-400">per seat</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4" style={{ borderTop: "2px solid #1a1a1a" }}>
            <div className="text-center">
              <p className="text-2xl font-black">{ride.availableSeats}</p>
              <p className="text-xs uppercase tracking-wider font-bold text-gray-400">Seats Left</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black">{ride.distanceKm || "---"}</p>
              <p className="text-xs uppercase tracking-wider font-bold text-gray-400">KM</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black" style={{ color: "#2e7d32" }}>{ride.co2SavedPerPassenger || 0}</p>
              <p className="text-xs uppercase tracking-wider font-bold text-gray-400">KG CO2 Saved</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="card animate-fade-up-delay-2">
            <h3 className="font-black uppercase tracking-wider text-sm mb-3" style={{ borderBottom: "2px solid #1a1a1a", paddingBottom: "6px" }}>Driver</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center text-sm font-black"
                style={{ background: "#ffe156", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}>
                {ride.driver?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-black">{ride.driver?.name}</p>
                <p className="text-sm text-gray-500">{ride.driver?.averageRating > 0 ? `${ride.driver.averageRating} stars` : "New driver"} / Trust: {ride.driver?.trustScore}</p>
              </div>
            </div>
          </div>
          <div className="card animate-fade-up-delay-2">
            <h3 className="font-black uppercase tracking-wider text-sm mb-3" style={{ borderBottom: "2px solid #1a1a1a", paddingBottom: "6px" }}>Vehicle</h3>
            <p className="font-bold">{ride.vehicle?.make} {ride.vehicle?.model}</p>
            <p className="text-sm text-gray-500">{ride.vehicle?.color} / {ride.vehicle?.registrationNumber}</p>
          </div>
        </div>

        {ride.description && (
          <div className="card mb-4 animate-fade-up-delay-3">
            <h3 className="font-black uppercase tracking-wider text-sm mb-2" style={{ borderBottom: "2px solid #1a1a1a", paddingBottom: "6px" }}>Notes</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{ride.description}</p>
          </div>
        )}

        {user?.role === "passenger" && ride.status === "scheduled" && !booked && (
          <div className="card-yellow p-6 animate-fade-up-delay-3" style={{ border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
            <h3 className="font-black uppercase tracking-wider text-sm mb-4">Book Seats</h3>
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm font-bold">Seats</label>
              <select value={seats} onChange={(e) => setSeats(Number(e.target.value))} className="input-field w-20 !py-2">
                {Array.from({ length: ride.availableSeats }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="text-sm font-bold">Total: <span className="text-xl font-black">&#8377;{ride.pricePerSeat * seats}</span></span>
            </div>
            <button onClick={handleBook} disabled={booking} className="btn-primary w-full" style={{ background: "#1a1a1a", color: "#ffe156" }}>
              {booking ? "Processing..." : "Book & Pay"}
            </button>
          </div>
        )}

        {booked && (
          <div className="p-6 text-center animate-fade-up" style={{ border: "3px solid #1a1a1a", background: "#b8f3b0", boxShadow: "6px 6px 0 #1a1a1a" }}>
            <p className="text-2xl font-black mb-1">✓ Booking Confirmed</p>
            <p className="text-sm text-gray-600">Payment received. Waiting for driver confirmation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideDetails;