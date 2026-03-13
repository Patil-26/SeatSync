// Base price is calculated from distance.
// Surge multiplier is applied based on demand vs supply ratio,
// time of day, and day of week. [web:171][web:182]

export const getBasePrice = (distanceKm) => {
  const baseFare = 50;          // flat base fare in INR
  const perKmRate = 8;          // INR per km
  return Math.round(baseFare + perKmRate * distanceKm);
};

export const getSurgeMultiplier = (availableRides, searchCount, departureTime) => {
  let multiplier = 1.0;

  // demand vs supply
  const demandRatio = searchCount / Math.max(availableRides, 1);
  if (demandRatio > 5) multiplier += 0.5;
  else if (demandRatio > 3) multiplier += 0.3;
  else if (demandRatio > 2) multiplier += 0.15;

  // time of day surge
  const hour = new Date(departureTime).getHours();
  const isPeakMorning = hour >= 7 && hour <= 10;
  const isPeakEvening = hour >= 17 && hour <= 21;
  const isNight = hour >= 22 || hour <= 5;

  if (isPeakMorning || isPeakEvening) multiplier += 0.2;
  if (isNight) multiplier += 0.15;

  // weekend surge
  const day = new Date(departureTime).getDay();
  const isWeekend = day === 0 || day === 6;
  if (isWeekend) multiplier += 0.1;

  return parseFloat(Math.min(multiplier, 2.5).toFixed(2)); // max 2.5x
};

export const getSuggestedPrice = (distanceKm, availableRides, searchCount, departureTime) => {
  const base = getBasePrice(distanceKm);
  const multiplier = getSurgeMultiplier(availableRides, searchCount, departureTime);
  const suggested = Math.round(base * multiplier);

  return {
    basePrice: base,
    surgeMultiplier: multiplier,
    suggestedPrice: suggested,
    label: multiplier >= 1.5
      ? "High Demand"
      : multiplier >= 1.2
      ? "Moderate Demand"
      : "Normal",
  };
};
