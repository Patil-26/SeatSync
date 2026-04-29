# SeatSync

A production-ready full-stack carpooling platform built with the MERN stack. Passengers search and book rides, drivers post and manage trips, and admins oversee the entire platform in real time.

---

## Tech Stack

| Layer       | Technology                                              |
|-------------|--------------------------------------------------------|
| Frontend    | React 19, Vite, Tailwind CSS, Zustand, React Router v7 |
| Backend     | Node.js, Express.js, MongoDB (Mongoose)                |
| Real-time   | Socket.io                                              |
| Maps        | Leaflet, OpenStreetMap, Nominatim                      |
| Auth        | JWT (access + refresh tokens, HTTP-only cookies)       |
| Email       | Nodemailer (Gmail SMTP)                                |
| Deployment  | Vercel (client) + Render (server)                      |

---

## Features

- Role-based authentication — Passenger, Driver, Admin
- OSM-powered city autocomplete with live Leaflet map preview
- Coordinate-based route matching using the Haversine formula (30km radius)
- Real-time booking requests and responses via Socket.io
- Mock payment modal — UPI, GPay, PhonePe, Card, Net Banking (Razorpay-ready)
- Auto-refund and passenger email notification on driver ride cancellation
- Cancellation window enforcement — drivers cannot cancel within 30hrs of departure (12hrs for Pro)
- Trust score system — automatically adjusted on ride events
- Ratings — passengers rate drivers and drivers rate passengers after trip completion
- In-app notification bell with unread count
- Email notifications on booking create, accept, and reject
- SOS emergency button on ongoing rides — broadcasts to co-passengers and admin
- Smart ride suggestions based on passenger booking history
- Pro subscription — priority listing, reduced cancellation penalties, larger cancellation window
- Admin dashboard — stats, ride monitoring, user management, driver verification, fraud detection

---

## Project Structure

```
SeatSync/
    client/
        public/
        src/
            api/                    # Axios instance with interceptors
            components/
                layout/             # Navbar
                shared/             # RideCard, LocationAutocomplete, MapPreview, Spinner
            pages/
                admin/              # AdminDashboard
                auth/               # Login, Register
                driver/             # PostRide, MyRides, DriverOnboarding
                passenger/          # SearchRides, RideDetails, MyBookings
            socket/                 # Socket.io client
            store/                  # Zustand stores: auth, ride, notification
        .env
        package.json

    server/
        src/
            config/                 # db.js, mailer.js
            controllers/            # auth, ride, booking, payment, admin, user, smart
            middleware/             # auth.middleware.js, role.middleware.js
            models/                 # User, Ride, Booking, DriverProfile
            routes/                 # All API route files
            socket/                 # socket.js
            utils/                  # routeMatching, trustScore, dynamicPricing, carbonTracker
        .env
        server.js
        package.json
```

---

## Prerequisites

- Node.js v18 or above
- npm v9 or above
- MongoDB Atlas free account — https://mongodb.com/cloud/atlas
- Gmail account with App Password enabled — https://myaccount.google.com/apppasswords

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Patil-26/SeatSync.git
cd SeatSync
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

---

## Environment Variables

### Backend — create `server/.env`

```
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/seatsync?appName=SeatSync
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_character_gmail_app_password
```

To get EMAIL_PASS: Google Account -> Security -> 2-Step Verification -> App Passwords -> generate one for Mail.

### Frontend — create `client/.env`

```
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

---

## Running Locally

Open two separate terminal windows.

### Terminal 1 — Backend

```bash
cd server
npm run dev
```

Expected output:

```
Server running on port 5001
MongoDB Connected: <your-cluster-host>
```

### Terminal 2 — Frontend

```bash
cd client
npm run dev
```

Expected output:

```
VITE ready in ~300ms
Local: http://localhost:5173/
```

Open your browser at `http://localhost:5173`

---

## How to Use

### As a Passenger

1. Go to /register, fill in your details, select Find Rides, create your account
2. Click Find Rides in the navbar
3. Type source and destination cities using the autocomplete — select from dropdown suggestions
4. Choose a date and number of seats, click Search
5. Click any ride card to view details — map, driver profile, vehicle, price
6. Scroll to Book Seats, choose number of seats, click Book & Pay
7. In the payment modal select UPI / Card / Net Banking, enter UPI ID, click Pay
8. Go to Bookings in the navbar to track all bookings and their status
9. Once a ride is completed, a Rate Driver button appears — click it to leave a review
10. During an ongoing ride a red SOS button appears on the ride detail page — clicking it sends an emergency alert to the driver and admin

### As a Driver

1. Go to /register, select Offer Rides, create your account
2. Go to Driver Onboarding, fill in vehicle details and license number, submit for verification
3. Wait for admin to verify your profile — you will receive an email once approved
4. Once verified, click Post Ride, search and select source and destination, fill in departure time, seats, and price, click Post Ride
5. Go to My Rides, click Passengers on any scheduled ride to view incoming booking requests
6. Click Accept or Reject on each request
7. After a completed ride, expand the passengers list and click Rate next to each passenger

### As an Admin

1. Login with an account that has role set to admin in MongoDB Atlas
2. Go to /admin to view platform overview — users, rides, bookings, revenue, CO2 saved
3. Click the Drivers tab to see all drivers with vehicle details, license, and verification status — click Verify or Reject
4. Click the Users tab to ban or activate users and manually adjust trust scores
5. Click the Rides tab to monitor all rides — filter by status
6. Click the Fraud tab to see users with low trust scores or high cancellation rates
7. SOS alerts appear in the notification bell in real time whenever a passenger triggers an emergency

---

## API Reference

### Auth

| Method | Endpoint           | Description       |
|--------|--------------------|-------------------|
| POST   | /api/auth/register | Register new user |
| POST   | /api/auth/login    | Login             |
| POST   | /api/auth/logout   | Logout            |
| GET    | /api/auth/me       | Get current user  |

### Rides

| Method | Endpoint                    | Description                  |
|--------|-----------------------------|------------------------------|
| GET    | /api/rides/search           | Search rides with filters    |
| POST   | /api/rides/create           | Post a new ride (driver)     |
| GET    | /api/rides/:id              | Get single ride details      |
| GET    | /api/rides/driver/my-rides  | Get driver's posted rides    |
| PUT    | /api/rides/:id/cancel       | Cancel a ride (driver)       |
| PUT    | /api/rides/:id/update       | Update ride details (driver) |

### Bookings

| Method | Endpoint                         | Description                    |
|--------|----------------------------------|--------------------------------|
| POST   | /api/bookings/create             | Book a ride (passenger)        |
| GET    | /api/bookings/my-bookings        | Get passenger's bookings       |
| PUT    | /api/bookings/:id/accept         | Accept a booking (driver)      |
| PUT    | /api/bookings/:id/reject         | Reject a booking (driver)      |
| PUT    | /api/bookings/:id/cancel         | Cancel a booking (passenger)   |
| PUT    | /api/bookings/:id/rate-driver    | Rate driver after ride         |
| PUT    | /api/bookings/:id/rate-passenger | Rate passenger after ride      |

### Payments

| Method | Endpoint                   | Description                |
|--------|----------------------------|----------------------------|
| POST   | /api/payments/create-order | Create payment order       |
| POST   | /api/payments/verify       | Verify and confirm payment |
| POST   | /api/payments/refund       | Process a refund           |

### Smart

| Method | Endpoint                      | Description                        |
|--------|-------------------------------|------------------------------------|
| GET    | /api/smart/suggestions        | Ride suggestions for passenger     |
| GET    | /api/smart/route-match        | Coordinate-based ride matching     |
| GET    | /api/smart/price-suggestion   | Dynamic price suggestion (driver)  |
| GET    | /api/smart/carbon-stats       | User CO2 savings stats             |
| GET    | /api/smart/trust-profile/:id  | Public trust profile for any user  |

### Admin

| Method | Endpoint                            | Description                     |
|--------|-------------------------------------|---------------------------------|
| GET    | /api/admin/dashboard                | Platform stats overview         |
| GET    | /api/admin/users                    | All users with filters          |
| PUT    | /api/admin/users/:id/activate       | Activate a user account         |
| PUT    | /api/admin/users/:id/deactivate     | Ban a user account              |
| PUT    | /api/admin/users/:id/trust-score    | Manually adjust trust score     |
| GET    | /api/admin/drivers                  | All drivers with verification   |
| PUT    | /api/admin/drivers/:id/verify       | Verify or reject a driver       |
| GET    | /api/admin/rides                    | All rides with status filter    |
| GET    | /api/admin/analytics/popular-routes | Top booked routes               |
| GET    | /api/admin/fraud/suspicious-users   | Low trust and high cancellation |

---

## Socket.io Events

| Event               | Direction                   | Description                         |
|---------------------|-----------------------------|-------------------------------------|
| booking:new_request | Server to Driver            | New booking request received        |
| booking:response    | Server to Passenger         | Booking accepted or rejected        |
| ride:status:update  | Server to Ride room         | Ride status changed                 |
| driver:location     | Driver to Ride room         | Live driver location update         |
| sos:trigger         | Passenger to Server         | Emergency SOS triggered             |
| sos:alert           | Server to Ride room + Admin | SOS broadcast to all parties        |
| message:send        | Client to Ride room         | In-ride chat message                |

---

## Deployment

### Backend on Render

1. Push your code to GitHub
2. Go to https://render.com and create a new Web Service
3. Connect your GitHub repository and set root directory to server
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add all variables from server/.env in the Render environment settings
7. Update CLIENT_URL to your Vercel frontend URL once deployed

### Frontend on Vercel

1. Go to https://vercel.com and import your GitHub repository
2. Set root directory to client
3. Add environment variables:
   - VITE_API_URL = https://your-render-app.onrender.com/api
   - VITE_SOCKET_URL = https://your-render-app.onrender.com
4. Deploy

---

## Known Limitations

- Payments are currently mocked — Razorpay integration is ready to plug in once KYC is complete
- Push notifications (FCM) are not yet implemented — in-app and email notifications are active
- Driver location tracking is socket-based and does not persist between sessions

---

## License

MIT

---

## Author

Atharva Patil — https://github.com/Patil-26