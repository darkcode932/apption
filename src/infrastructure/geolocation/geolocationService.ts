export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export class GeolocationService {
  async getCurrentLocation(): Promise<LocationData> {
    let data: LocationData = {
      latitude: 4.05, // Douala, Cameroun default fallback
      longitude: 9.7,
      city: "Douala",
      country: "Cameroun",
    };

    // 1. Fetch approximate city, country, and coords by IP
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (res.ok) {
        const ipInfo = await res.json();
        data = {
          latitude: ipInfo.latitude || data.latitude,
          longitude: ipInfo.longitude || data.longitude,
          city: ipInfo.city || data.city,
          country: ipInfo.country_name || data.country,
        };
      }
    } catch (e) {
      console.warn("IP Geolocation fetch failed:", e);
    }

    // 2. Try to refine coordinates using precise HTML5 Geolocation
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      try {
        const gpsCoords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => reject(error),
            { timeout: 5000 }
          );
        });
        data.latitude = gpsCoords.latitude;
        data.longitude = gpsCoords.longitude;
      } catch (gpsError) {
        console.warn("HTML5 Geolocation declined/failed, using IP approximation:", gpsError);
      }
    }

    return data;
  }

  getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }
}

export const geolocationService = new GeolocationService();
