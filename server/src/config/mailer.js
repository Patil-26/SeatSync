import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"SeatSync" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email send failed:", err.message);
  }
};

export const bookingRequestEmail = (passengerName, ride) => ({
  subject: "Booking Request Sent — SeatSync",
  html: `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2 style="background:#ffe156;padding:12px;border:2px solid #1a1a1a;display:inline-block">SEATSYNC</h2>
      <h3>Hey ${passengerName},</h3>
      <p>Your booking request for <strong>${ride.source.name} → ${ride.destination.name}</strong> has been sent to the driver.</p>
      <p>You'll be notified once the driver responds.</p>
      <p style="color:#888;font-size:12px">— The SeatSync Team</p>
    </div>
  `,
});

export const bookingAcceptedEmail = (passengerName, ride) => ({
  subject: "Booking Accepted ✓ — SeatSync",
  html: `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2 style="background:#ffe156;padding:12px;border:2px solid #1a1a1a;display:inline-block">SEATSYNC</h2>
      <h3>Great news, ${passengerName}!</h3>
      <p>Your booking for <strong>${ride.source.name} → ${ride.destination.name}</strong> has been <strong style="color:green">accepted</strong> by the driver.</p>
      <p>Departure: <strong>${new Date(ride.departureTime).toLocaleString("en-IN")}</strong></p>
      <p style="color:#888;font-size:12px">— The SeatSync Team</p>
    </div>
  `,
});

export const bookingRejectedEmail = (passengerName, ride) => ({
  subject: "Booking Update — SeatSync",
  html: `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2 style="background:#ffe156;padding:12px;border:2px solid #1a1a1a;display:inline-block">SEATSYNC</h2>
      <h3>Hey ${passengerName},</h3>
      <p>Unfortunately your booking for <strong>${ride.source.name} → ${ride.destination.name}</strong> was <strong style="color:red">not accepted</strong> by the driver.</p>
      <p>Try searching for other available rides!</p>
      <p style="color:#888;font-size:12px">— The SeatSync Team</p>
    </div>
  `,
});