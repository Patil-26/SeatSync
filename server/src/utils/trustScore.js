// Trust score starts at 50 for every user.
// It goes up for good behavior and down for bad behavior.
// Score is clamped between 0 and 100.

export const calculateTrustScore = (currentScore, event) => {
  const weights = {
    ride_completed: +3,
    five_star_rating: +5,
    four_star_rating: +2,
    three_star_rating: 0,
    two_star_rating: -3,
    one_star_rating: -5,
    booking_cancelled_by_passenger: -2,
    booking_cancelled_by_driver: -3,
    ride_cancelled_by_driver: -4,
    no_show: -6,
    complaint_received: -8,
    complaint_resolved_in_favor: +4,
    account_verified: +10,
  };

  const change = weights[event] ?? 0;
  const newScore = currentScore + change;

  return Math.min(100, Math.max(0, newScore));
};

export const getTrustLabel = (score) => {
  if (score >= 80) return "Highly Trusted";
  if (score >= 60) return "Trusted";
  if (score >= 40) return "Neutral";
  if (score >= 20) return "Low Trust";
  return "Unreliable";
};
