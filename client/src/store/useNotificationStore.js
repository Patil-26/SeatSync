import { create } from "zustand";
import { getSocket } from "../socket/socket.js";

const useNotificationStore = create((set, get) => ({
  notifications: [],

  initNotificationListeners: () => {
    const socket = getSocket();
    if (!socket) return;

    // New booking request (driver receives)
    socket.on("booking:new_request", (data) => {
      get().addNotification({
        id: Date.now(),
        type: "booking_request",
        title: "New Booking Request",
        message: `${data.passengerName || "A passenger"} wants to book your ride`,
        data,
        read: false,
        createdAt: new Date(),
      });
    });

    // Booking accepted/rejected (passenger receives)
    socket.on("booking:response", ({ status, bookingData }) => {
      get().addNotification({
        id: Date.now(),
        type: status === "accepted" ? "booking_accepted" : "booking_rejected",
        title: status === "accepted" ? "Booking Accepted!" : "Booking Update",
        message: status === "accepted"
          ? `Your booking was accepted by the driver`
          : `Your booking was not accepted`,
        data: bookingData,
        read: false,
        createdAt: new Date(),
      });
    });

    // Ride status updates
    socket.on("ride:status:update", ({ rideId, status }) => {
      get().addNotification({
        id: Date.now(),
        type: "ride_status",
        title: "Ride Update",
        message: `Ride status changed to ${status}`,
        data: { rideId, status },
        read: false,
        createdAt: new Date(),
      });
    });
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 20),
    }));
  },

  markAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  markRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  clearAll: () => set({ notifications: [] }),

  unreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },
}));

export default useNotificationStore;