# SeatSync 🚗

> A full-stack carpooling platform built with the MERN stack. Search rides, book seats, pay online, rate drivers, and travel smarter — all in one place.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Zustand, React Router v7 |
| Backend | Node.js, Express, MongoDB (Mongoose) |
| Real-time | Socket.io |
| Maps | Leaflet, OpenStreetMap, Nominatim |
| Auth | JWT (access + refresh tokens via HTTP-only cookies) |
| Email | Nodemailer (Gmail SMTP) |
| Deployment | Vercel (client) + Render (server) |

---

## Features

- **Authentication** — Register as passenger or driver, JWT-based login with refresh tokens
- **Maps + Location** — Nominatim-powered city autocomplete with live Leaflet map preview
- **Ride Search** — Coordinate-based route matching using the Haversine formula (30km radius)
- **Bookings** — Book seats, accept/reject requests, cancel rides
- **Payments** — UPI / GPay / PhonePe / Card / Net Banking modal (mock, Razorpay-ready)
- **Ratings** — Passengers rate drivers and drivers rate passengers after ride completion
- **Notifications** — In-app bell (Socket.io) + email alerts on booking events
- **SOS / Safety** — Emergency alert button on ongoing rides, broadcasts to admin + co-passengers
- **Admin Dashboard** — Stats, ride monitoring, user management, driver verification, fraud detection
- **Trust Score** — Dynamic trust scoring system tied to ride history and ratings
- **CO2 Tracker** — Estimated carbon savings displayed per ride

---

## Project Structure

```
SeatSync/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── api/             # Axios instance
│   │   ├── components/      # Navbar, RideCard, LocationAutocomplete, MapPreview, etc.
│   │   ├── pages/
│   │   │   ├── admin/       # AdminDashboard
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── driver/      # PostRide, MyRides, DriverOnboarding
│   │   │   └── passenger/   # SearchRides, RideDetails, MyBookings
│   │   ├── socket/          # Socket.io client
│   │   └── store/           # Zustand stores (auth, ride, notification)
│   ├── .env                 # Frontend environment variables
│   └── package.json
│
└── server/                  # Express backend
    ├── src/
    │   ├── config/          # DB, Cloudinary, Mailer
    │   ├── controllers/     # Auth, Ride, Booking, Payment, Admin, User
    │   ├── middleware/       # Auth, Role protection
    │   ├── models/          # User, Ride, Booking, DriverProfile
    │   ├── routes/          # All API routes
    │   ├── socket/          # Socket.io server
    │   └── utils/           # RouteMatching, TrustScore, DynamicPricing, CarbonTracker
    ├── .env                 # Backend environment variables
    └── package.json
```

---

## Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org) v18 or above
- [npm](https://npmjs.com) v9 or above
- A [MongoDB Atlas](https://mongodb.com/cloud/atlas) free account
- A Gmail account with [App Password](https://myaccount.google.com/apppasswords) enabled

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Patil-26/SeatSync.git
cd SeatSync
```

### 2. Install dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### 3. Configure environment variables

**Backend — create `server/.env`:**
```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/seatsync?appName=SeatSync
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_gmail_app_password
```

**Frontend — create `client/.env`:**
```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

> **Note:** For `EMAIL_PASS`, go to Google Account → Security → 2-Step Verification → App Passwords → generate one for Mail.

### 4. Run the development servers

Open **two terminal tabs** and run one in each:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

You should see:
```
Server running on port 5001
MongoDB Connected: <your-cluster>
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

You should see:
```
VITE ready in ~300ms
Local: http://localhost:5173/
```

### 5. Open in browser

```
http://localhost:5173
```

---

## How to Use

### As a Passenger

1. **Register** — go to `/register`, enter your details, select **"Find Rides"**
2. **Search rides** — click "Find Rides" in the navbar, type source and destination city, select a date and number of seats, click **Search**
3. **View a ride** — click any ride card to see full details, map preview, driver info, and vehicle
4. **Book a seat** — scroll down on the ride detail page, select number of seats, click **"Book & Pay"**
5. **Pay** — choose UPI/Card/Net Banking in the payment modal, enter UPI ID, click **Pay**
6. **Track bookings** — go to **Bookings** in the navbar to see all your bookings and their status
7. **Rate driver** — after a completed ride, click **"★ Rate Driver"** on your booking to leave a review
8. **SOS** — during an ongoing ride, a red **SOS** button appears on the ride detail page — click it to send an emergency alert

### As a Driver

1. **Register** — go to `/register`, select **"Offer Rides"**
2. **Complete onboarding** — go to **Driver Onboarding**, fill in your vehicle details and license number, submit for admin verification
3. **Wait for verification** — admin will verify your profile before you can post rides
4. **Post a ride** — once verified, click **Post Ride** in the navbar, search and select source + destination from the autocomplete, fill in departure time, seats, and price, click **Post Ride**
5. **Manage bookings** — go to **My Rides**, click **"Passengers"** on any ride to see booking requests, accept or reject them
6. **Rate passengers** — after a completed ride, click **"★ Rate"** next to each passenger

### As an Admin

1. **Login** — use an account with role set to `admin` in MongoDB
2. **Dashboard** — go to `/admin` to see platform stats
3. **Verify drivers** — click the **Drivers** tab, review vehicle and license details, click **Verify** or **Reject**
4. **Manage users** — click the **Users** tab to ban/activate users or adjust trust scores
5. **Monitor rides** — click the **Rides** tab, filter by status
6. **Fraud detection** — click the **Fraud** tab to see low-trust users and high cancellation accounts
7. **SOS alerts** — admin receives real-time SOS alerts via the notification bell

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/rides/search` | Search rides |
| POST | `/api/rides/create` | Post a ride (driver) |
| GET | `/api/rides/:id` | Get ride details |
| POST | `/api/bookings/create` | Book a ride |
| PUT | `/api/bookings/:id/accept` | Accept booking (driver) |
| PUT | `/api/bookings/:id/reject` | Reject booking (driver) |
| PUT | `/api/bookings/:id/cancel` | Cancel booking (passenger) |
| PUT | `/api/bookings/:id/rate-driver` | Rate driver |
| PUT | `/api/bookings/:id/rate-passenger` | Rate passenger |
| POST | `/api/payments/create-order` | Create payment order |
| POST | `/api/payments/verify` | Verify payment |
| GET | `/api/admin/dashboard` | Admin stats |
| GET | `/api/admin/drivers` | All drivers with verification status |
| PUT | `/api/admin/drivers/:id/verify` | Verify/reject driver |

---

## Socket.io Events

| Event | Direction | Description |
|---|---|---|
| `booking:new_request` | Server → Driver | New booking notification |
| `booking:response` | Server → Passenger | Booking accepted/rejected |
| `ride:status:update` | Server → Ride room | Ride status changed |
| `driver:location` | Driver → Ride room | Live driver location |
| `sos:trigger` | Passenger → Server | Emergency SOS alert |
| `sos:alert` | Server → Ride room + Admin | SOS broadcast |
| `message:send` | Client → Ride room | In-ride chat message |

---

## Deployment

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Connect your GitHub repo, set root directory to `server`
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add all environment variables from `server/.env`

### Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com), import your GitHub repo
2. Set root directory to `client`
3. Add environment variables:
   ```
   VITE_API_URL=https://your-render-app.onrender.com/api
   VITE_SOCKET_URL=https://your-render-app.onrender.com
   ```
4. Deploy

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT

---

Built by [Patil Atharva](https://github.com/Patil-26)