// Average petrol car emits 0.21 kg CO2 per km.
// If N passengers share the ride, each saves (N-1)/N * 0.21 * distance kg.
// Source: UK DESNZ 2024 emission factors [web:173]

export const calculateCO2Saved = (distanceKm, passengers) => {
  if (!distanceKm || passengers < 1) return 0;

  const emissionsPerKm = 0.21;
  const totalIfAlone = emissionsPerKm * distanceKm * passengers;
  const totalShared = emissionsPerKm * distanceKm;
  const saved = totalIfAlone - totalShared;

  return parseFloat(saved.toFixed(2));
};

export const getCO2Badge = (totalKgSaved) => {
  if (totalKgSaved >= 500) return "Planet Hero";
  if (totalKgSaved >= 200) return "Eco Champion";
  if (totalKgSaved >= 100) return "Green Traveler";
  if (totalKgSaved >= 50) return "Eco Starter";
  return "New Member";
};

export const getEquivalent = (totalKgSaved) => {
  // 1 tree absorbs ~21 kg CO2 per year
  const trees = Math.floor(totalKgSaved / 21);
  // avg phone charge = 0.008 kg CO2
  const phoneCharges = Math.floor(totalKgSaved / 0.008);
  return { trees, phoneCharges };
};
