export interface POI {
  id: number;
  name: string;
  lat: number;
  lng: number;
  radius: number;
}

export const POIs: POI[] = [
  // { id: 1, name: "POI1", lng: 1.206348, lat: 41.186903, radius: 5 },
  // { id: 2, name: "POI2", lng: 1.202488, lat: 41.187902, radius: 5 },
  // { id: 3, name: "POI3", lng: 1.199990, lat: 41.188451, radius: 5 },
  // { id: 4, name: "POI4", lng: 1.198763, lat: 41.186202, radius: 5 },
  // { id: 5, name: "POI5", lng: 1.192280, lat: 41.183406, radius: 5 },
  // { id: 6, name: "POI6", lng: 1.191127, lat: 41.182122, radius: 5 },
  // { id: 7, name: "POI7", lng: 1.193170, lat: 41.180683, radius: 5 },
  // { id: 8, name: "POI8", lng: 1.195074, lat: 41.178756, radius: 5 },
  // { id: 9, name: "POI9", lng: 1.198254, lat: 41.179745, radius: 5 },
  // { id: 10, name: "POI10", lng: 1.199990, lat: 41.179673, radius: 5 },
  // { id: 11, name: "POI11", lng: 1.203178, lat: 41.183752, radius: 5 },
  // { id: 12, name: "POI12", lng: 1.205544, lat: 41.185057, radius: 5 },
  { id: 1, name: "POI1", lng: 1.724675, lat: 41.214502, radius: 5 },
  { id: 2, name: "POI2", lng: 1.725477, lat: 41.214584, radius: 5 },
  { id: 3, name: "POI3", lng: 1.725301, lat: 41.214864, radius: 5 },
  { id: 4, name: "POI4", lng: 1.725007, lat: 41.215348, radius: 5 },
  { id: 5, name: "POI5", lng: 1.725156, lat: 41.215096, radius: 5 },
  { id: 6, name: "POI6", lng: 1.724870, lat: 41.215550, radius: 5 },
  { id: 7, name: "POI7", lng: 1.724686, lat: 41.215899, radius: 5 },
  { id: 8, name: "POI8", lng: 1.724577, lat: 41.216091, radius: 5 },
  { id: 9, name: "POI9", lng: 1.724400, lat: 41.216293, radius: 5 },
  { id: 10, name: "POI10", lng: 1.724566, lat: 41.216080, radius: 5 },
  { id: 11, name: "POI11", lng: 1.724904, lat: 41.215554, radius: 5 },
  { id: 12, name: "POI12", lng: 1.725248, lat: 41.214973, radius: 5 },
];

// Coin configuration for each POI (0-indexed)
// Each array represents the coin values that should spawn
// null means this POI doesn't have coins (quiz POIs)
// The number of coins shown equals the array length
export const POICoinConfig: (number[] | null)[] = [
  [3, 3, 3, 3, 3], // POI1: 5 coins, total 15 (3+3+3+3+3=15)
  [4, 4, 4, 4, 4], // POI2: 5 coins, total 20 (4+4+4+4+4=20)
  null, // POI3: Quiz POI, no coins
  [5, 5, 5, 5, 5, 5, 5], // POI4: 7 coins, total 35 (5+5+5+5+5+5+5=35)
  [3, 3, 3, 3, 3], // POI5: 5 coins, total 15 (3+3+3+3+3=15)
  null, // POI6: Quiz POI, no coins
  [6, 6, 6, 6, 6, 6, 9], // POI7: 7 coins, total 45 (6+6+6+6+6+6+9=45)
  [7, 7, 7, 7, 7, 7, 8], // POI8: 7 coins, total 50 (7+7+7+7+7+7+8=50)
  null, // POI9: Quiz POI, no coins
  [8, 8, 8, 8, 8, 8, 7], // POI10: 7 coins, total 55 (8+8+8+8+8+8+7=55)
  [3, 3, 3, 4, 4], // POI11: 5 coins, total 17 (3+3+3+4+4=17)
  null, // POI12: Quiz POI, no coins
];

// Get total coins required for a POI (0-indexed)
export const getPOITotalCoins = (poiIndex: number): number => {
  const config = POICoinConfig[poiIndex];
  if (!config) return 0;
  return config.reduce((sum, val) => sum + val, 0);
};

// Get coin configuration for a POI (0-indexed)
export const getPOICoinConfig = (poiIndex: number): number[] | null => {
  return POICoinConfig[poiIndex] || null;
};