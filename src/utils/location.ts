export interface POI {
  id: number;
  name: string;
  lat: number;
  lng: number;
  radius: number;
}

export const POIs: POI[] = [
  { id: 1, name: "POI1", lng: 1.206348, lat: 41.186903, radius: 5 },
  { id: 2, name: "POI2", lng: 1.202488, lat: 41.187902, radius: 5 },
  { id: 3, name: "POI3", lng: 1.199990, lat: 41.188451, radius: 5 },
  { id: 4, name: "POI4", lng: 1.198763, lat: 41.186202, radius: 5 },
  { id: 5, name: "POI5", lng: 1.192280, lat: 41.183406, radius: 5 },
  { id: 6, name: "POI6", lng: 1.191127, lat: 41.182122, radius: 5 },
  { id: 7, name: "POI7", lng: 1.193170, lat: 41.180683, radius: 5 },
  { id: 8, name: "POI8", lng: 1.195074, lat: 41.178756, radius: 5 },
  { id: 9, name: "POI9", lng: 1.198254, lat: 41.179745, radius: 5 },
  { id: 10, name: "POI10", lng: 1.199990, lat: 41.179673, radius: 5 },
  { id: 11, name: "POI11", lng: 1.203178, lat: 41.183752, radius: 5 },
  { id: 12, name: "POI12", lng: 1.205544, lat: 41.185057, radius: 5 },
];
