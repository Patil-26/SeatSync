import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useAuthStore from "../../store/useAuthStore.js";
import useNotificationStore from "../../store/useNotificationStore.js";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { notifications, markAllRead, clearAll, initNotificationListeners } = useNotificationStore();
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (user) initNotificationListeners();
  }, [user]);

  useEffect(() => {
    const handleClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleBellClick = () => {
    setBellOpen((prev) => !prev);
    if (!bellOpen) markAllRead();
  };

  const typeIcon = (type) => {
    if (type === "booking_request") return "📥";
    if (type === "booking_accepted") return "✅";
    if (type === "booking_rejected") return "❌";
    if (type === "ride_status") return "🚗";
    return "🔔";
  };

  return (
    <nav className="sticky top-0 z-50" style={{ background: "#fffef5", borderBottom: "3px solid #1a1a1a" }}>
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter">
          SEAT<span style={{ background: "#ffe156", padding: "0 4px", border: "2px solid #1a1a1a" }}>SYNC</span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <Link to="/search" className="text-sm font-bold uppercase tracking-wider hover:bg-yellow-200 px-3 py-1 transition-colors border-b-2 border-transparent hover:border-black">
              Find Rides
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="text-sm font-bold uppercase tracking-wider hover:bg-yellow-200 px-3 py-1 transition-colors">Login</Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 !text-xs">Sign Up</Link>
            </>
          ) : (
            <>
              {user.role === "driver" && (
                <>
                  <Link to="/post-ride" className="text-sm font-bold uppercase tracking-wider hover:bg-yellow-200 px-3 py-1 transition-colors">Post Ride</Link>
                  <Link to="/my-rides" className="text-sm font-bold uppercase tracking-wider hover:bg-yellow-200 px-3 py-1 transition-colors">My Rides</Link>
                </>
              )}
              {user.role === "passenger" && (
                <Link to="/my-bookings" className="text-sm font-bold uppercase tracking-wider hover:bg-yellow-200 px-3 py-1 transition-colors">Bookings</Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin" className="text-sm font-bold uppercase tracking-wider hover:bg-yellow-200 px-3 py-1 transition-colors">Admin</Link>
              )}

              {/* Bell */}
              <div ref={bellRef} className="relative">
                <button
                  onClick={handleBellClick}
                  className="relative w-9 h-9 flex items-center justify-center transition-colors hover:bg-yellow-200"
                  style={{ border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}
                >
                  <span style={{ fontSize: "16px" }}>🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-xs font-black"
                      style={{ background: "#ff6b6b", border: "1.5px solid #1a1a1a", borderRadius: "50%", fontSize: "9px", color: "#fff" }}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {bellOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white z-[999]"
                    style={{ border: "2px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a" }}>
                    <div className="flex justify-between items-center px-4 py-3"
                      style={{ borderBottom: "2px solid #1a1a1a" }}>
                      <p className="font-black text-sm uppercase tracking-wider">Notifications</p>
                      {notifications.length > 0 && (
                        <button onClick={clearAll} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <p className="text-2xl mb-2">🔔</p>
                          <p className="text-sm font-bold text-gray-400">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id}
                            className="px-4 py-3 border-b border-gray-100 last:border-0"
                            style={{ background: n.read ? "transparent" : "#fffbea" }}>
                            <div className="flex items-start gap-2">
                              <span style={{ fontSize: "16px" }}>{typeIcon(n.type)}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-black truncate">{n.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                                <p className="text-xs text-gray-300 mt-1">
                                  {new Date(n.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handleLogout}
                className="text-sm font-bold uppercase tracking-wider hover:bg-red-200 px-3 py-1 transition-colors cursor-pointer">
                Logout
              </button>

              <div className="w-9 h-9 flex items-center justify-center text-sm font-black"
                style={{ background: "#ffe156", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;