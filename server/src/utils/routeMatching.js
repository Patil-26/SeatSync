// Haversine formula: calculates straight-line distance
// between two GPS coordinates in km. [web:109]

export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

// Checks if a passenger's source and destination are
// within acceptable radius of a ride's route.
export const isRouteMatch = (
  passengerSourceLat, passengerSourceLon,
  passengerDestLat, passengerDestLon,
  rideSourceLat, rideSourceLon,
  rideDestLat, rideDestLon,
  radiusKm = 30
) => {
  const sourceDistance = haversineDistance(
    passengerSourceLat, passengerSourceLon,
    rideSourceLat, rideSourceLon
  );

  const destDistance = haversineDistance(
    passengerDestLat, passengerDestLon,
    rideDestLat, rideDestLon
  );

  return {
    isMatch: sourceDistance <= radiusKm && destDistance <= radiusKm,
    sourceDistance,
    destDistance,
  };
};
