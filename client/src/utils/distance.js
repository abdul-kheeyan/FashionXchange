/**
 * Haversine distance formula (client-side)
 */
export const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const toRad = (deg) => (deg * Math.PI) / 180

export const formatDistance = (km) => {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${Math.round(km)} km`
}

/** Known Indian city coordinates */
export const CITY_COORDS = {
  'Mumbai':    { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  'Delhi':     { lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  'Bangalore': { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  'Pune':      { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  'Chennai':   { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  'Kolkata':   { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  'Jaipur':    { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  'Surat':     { lat: 21.1702, lng: 72.8311, state: 'Gujarat' },
}

export const CITIES = Object.keys(CITY_COORDS)
