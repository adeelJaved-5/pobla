// src/utils.ts
export interface Coordinates {
  lat: number;
  lng: number;
}

export function haversineDistance(loc1: any, loc2: any): number {
  const toRad = (val: number): number => (val * Math.PI) / 180;
  const R = 6371; 

  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lng - loc1.lng);
  const lat1 = toRad(loc1.lat);
  const lat2 = toRad(loc2.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


export function distanceCalculation(
  loc1: { latitude: number; longitude: number },
  loc2: { latitude: number; longitude: number }
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371000; 
  const lat1 = toRad(loc1.latitude);
  const lat2 = toRad(loc2.latitude);
  const deltaLat = toRad(loc2.latitude - loc1.latitude);
  const deltaLon = toRad(loc2.longitude - loc1.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; 
  console.log('Distance from formula',distance);
  return distance;
}
