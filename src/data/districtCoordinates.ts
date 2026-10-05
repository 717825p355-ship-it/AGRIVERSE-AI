// Coordinates and agro-climatic metadata for Indian Districts
export interface DistrictCoordinates {
  lat: number;
  lng: number;
  elevation: number; // in meters
  annualRainfall: number; // in mm
  avgTempSummer: number; // in °C
  avgTempWinter: number; // in °C
  soilTypes: string[];
  majorRiverBasin: string;
}

export const DISTRICT_COORDINATES: Record<string, DistrictCoordinates> = {
  // Tamil Nadu
  'Coimbatore': { lat: 11.0168, lng: 76.9558, elevation: 411, annualRainfall: 680, avgTempSummer: 35, avgTempWinter: 21, soilTypes: ['Red Sandy Loam', 'Black Cotton Soil'], majorRiverBasin: 'Noyyal / Bhavani' },
  'Thanjavur': { lat: 10.7870, lng: 79.1378, elevation: 57, annualRainfall: 1125, avgTempSummer: 37, avgTempWinter: 23, soilTypes: ['Alluvial / Deltaic Soil', 'Clayey Loam'], majorRiverBasin: 'Cauvery Delta' },
  'Madurai': { lat: 9.9252, lng: 78.1198, elevation: 101, annualRainfall: 850, avgTempSummer: 38, avgTempWinter: 22, soilTypes: ['Red Soil', 'Black Cotton Soil'], majorRiverBasin: 'Vaigai' },
  'Erode': { lat: 11.3410, lng: 77.7172, elevation: 183, annualRainfall: 710, avgTempSummer: 36, avgTempWinter: 21, soilTypes: ['Red Loam', 'Black Soil'], majorRiverBasin: 'Kaveri' },
  'Salem': { lat: 11.6643, lng: 78.1460, elevation: 278, annualRainfall: 880, avgTempSummer: 37, avgTempWinter: 20, soilTypes: ['Red Sandy Loam', 'Laterite'], majorRiverBasin: 'Thirumanimuthar' },
  'Tiruchirappalli': { lat: 10.7905, lng: 78.7047, elevation: 88, annualRainfall: 840, avgTempSummer: 38, avgTempWinter: 22, soilTypes: ['Alluvial', 'Red Soil'], majorRiverBasin: 'Cauvery' },
  'Tirunelveli': { lat: 8.7139, lng: 77.7567, elevation: 47, annualRainfall: 880, avgTempSummer: 36, avgTempWinter: 22, soilTypes: ['Deep Black Soil', 'Red Sandy Soil'], majorRiverBasin: 'Thamirabarani' },
  'Vellore': { lat: 12.9165, lng: 79.1325, elevation: 216, annualRainfall: 970, avgTempSummer: 38, avgTempWinter: 19, soilTypes: ['Red Sandy Loam', 'Clay Loam'], majorRiverBasin: 'Palar' },
  'Cuddalore': { lat: 11.7480, lng: 79.7714, elevation: 6, annualRainfall: 1310, avgTempSummer: 36, avgTempWinter: 22, soilTypes: ['Alluvial Coastal', 'Clayey'], majorRiverBasin: 'Ponnaiyar' },
  'Kanchipuram': { lat: 12.8342, lng: 79.7036, elevation: 82, annualRainfall: 1200, avgTempSummer: 37, avgTempWinter: 21, soilTypes: ['Alluvial Clay', 'Red Soil'], majorRiverBasin: 'Palar' },

  // Punjab
  'Ludhiana': { lat: 30.9010, lng: 75.8573, elevation: 244, annualRainfall: 680, avgTempSummer: 41, avgTempWinter: 7, soilTypes: ['Alluvial Loam', 'Sandy Loam'], majorRiverBasin: 'Sutlej' },
  'Amritsar': { lat: 31.6340, lng: 74.8723, elevation: 234, annualRainfall: 688, avgTempSummer: 40, avgTempWinter: 5, soilTypes: ['Deep Alluvial Soil'], majorRiverBasin: 'Ravi / Beas' },
  'Jalandhar': { lat: 31.3260, lng: 75.5762, elevation: 228, annualRainfall: 700, avgTempSummer: 41, avgTempWinter: 6, soilTypes: ['Alluvial Loam'], majorRiverBasin: 'Beas' },
  'Patiala': { lat: 30.3398, lng: 76.3869, elevation: 250, annualRainfall: 650, avgTempSummer: 40, avgTempWinter: 7, soilTypes: ['Alluvial Clay Loam'], majorRiverBasin: 'Ghaggar' },
  'Bathinda': { lat: 30.2110, lng: 74.9455, elevation: 211, annualRainfall: 410, avgTempSummer: 43, avgTempWinter: 5, soilTypes: ['Sandy Loam', 'Arid Soil'], majorRiverBasin: 'Canal System' },

  // Maharashtra
  'Nashik': { lat: 20.0059, lng: 73.7898, elevation: 584, annualRainfall: 1020, avgTempSummer: 37, avgTempWinter: 12, soilTypes: ['Black Basaltic Soil', 'Red Loam'], majorRiverBasin: 'Godavari' },
  'Pune': { lat: 18.5204, lng: 73.8567, elevation: 560, annualRainfall: 750, avgTempSummer: 37, avgTempWinter: 12, soilTypes: ['Medium Black Cotton Soil'], majorRiverBasin: 'Bhima / Mutha' },
  'Nagpur': { lat: 21.1458, lng: 79.0882, elevation: 310, annualRainfall: 1160, avgTempSummer: 44, avgTempWinter: 13, soilTypes: ['Deep Black Cotton Soil'], majorRiverBasin: 'Kanhan' },
  'Ahmednagar': { lat: 19.0948, lng: 74.7480, elevation: 649, annualRainfall: 580, avgTempSummer: 39, avgTempWinter: 14, soilTypes: ['Black Soil', 'Shallow Red Soil'], majorRiverBasin: 'Pravara' },
  'Solapur': { lat: 17.6599, lng: 75.9064, elevation: 458, annualRainfall: 540, avgTempSummer: 42, avgTempWinter: 16, soilTypes: ['Medium to Deep Black Soil'], majorRiverBasin: 'Bhima' },

  // Uttar Pradesh
  'Varanasi': { lat: 25.3176, lng: 82.9739, elevation: 81, annualRainfall: 1050, avgTempSummer: 42, avgTempWinter: 9, soilTypes: ['Ganga Alluvial Soil'], majorRiverBasin: 'Ganga' },
  'Lucknow': { lat: 26.8467, lng: 80.9462, elevation: 123, annualRainfall: 890, avgTempSummer: 41, avgTempWinter: 8, soilTypes: ['Alluvial Silt Loam'], majorRiverBasin: 'Gomti' },
  'Agra': { lat: 27.1767, lng: 78.0081, elevation: 171, annualRainfall: 650, avgTempSummer: 44, avgTempWinter: 7, soilTypes: ['Sandy Alluvial', 'Saline Loam'], majorRiverBasin: 'Yamuna' },
  'Kanpur': { lat: 26.4499, lng: 80.3319, elevation: 126, annualRainfall: 820, avgTempSummer: 42, avgTempWinter: 8, soilTypes: ['Gangetic Alluvium'], majorRiverBasin: 'Ganga / Yamuna' },
  'Gorakhpur': { lat: 26.7606, lng: 83.3732, elevation: 84, annualRainfall: 1250, avgTempSummer: 39, avgTempWinter: 9, soilTypes: ['Terai Alluvial Soil'], majorRiverBasin: 'Rapti' },

  // Karnataka
  'Mysore': { lat: 12.2958, lng: 76.6394, elevation: 763, annualRainfall: 800, avgTempSummer: 34, avgTempWinter: 17, soilTypes: ['Red Loam', 'Red Clay'], majorRiverBasin: 'Kaveri / Kabini' },
  'Bengaluru Urban': { lat: 12.9716, lng: 77.5946, elevation: 920, annualRainfall: 970, avgTempSummer: 34, avgTempWinter: 15, soilTypes: ['Red Loamy Soil'], majorRiverBasin: 'Arkavathi' },
  'Belagavi': { lat: 15.8497, lng: 74.4977, elevation: 762, annualRainfall: 1350, avgTempSummer: 36, avgTempWinter: 14, soilTypes: ['Deep Black Cotton', 'Laterite'], majorRiverBasin: 'Krishna / Malaprabha' },
  'Shimoga': { lat: 13.9299, lng: 75.5681, elevation: 569, annualRainfall: 1810, avgTempSummer: 34, avgTempWinter: 16, soilTypes: ['Red Sandy', 'Laterite Soil'], majorRiverBasin: 'Tunga / Bhadra' },

  // Andhra Pradesh & Telangana
  'Guntur': { lat: 16.3067, lng: 80.4365, elevation: 33, annualRainfall: 890, avgTempSummer: 42, avgTempWinter: 18, soilTypes: ['Black Cotton Soil', 'Delta Alluvial'], majorRiverBasin: 'Krishna Delta' },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, elevation: 542, annualRainfall: 810, avgTempSummer: 40, avgTempWinter: 15, soilTypes: ['Red Sandy Loam', 'Rocky Soil'], majorRiverBasin: 'Musi' },
  'Warangal': { lat: 17.9689, lng: 79.5941, elevation: 302, annualRainfall: 990, avgTempSummer: 42, avgTempWinter: 16, soilTypes: ['Chalka Soil', 'Black Soil'], majorRiverBasin: 'Godavari Basin' },

  // Rajasthan
  'Jaipur': { lat: 26.9124, lng: 75.7873, elevation: 431, annualRainfall: 520, avgTempSummer: 42, avgTempWinter: 8, soilTypes: ['Sandy Loam', 'Alluvial'], majorRiverBasin: 'Bandi / Dhund' },
  'Jodhpur': { lat: 26.2389, lng: 73.0243, elevation: 231, annualRainfall: 360, avgTempSummer: 44, avgTempWinter: 9, soilTypes: ['Desert Arid Sandy Soil'], majorRiverBasin: 'Luni' },

  // Gujarat
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, elevation: 53, annualRainfall: 750, avgTempSummer: 42, avgTempWinter: 12, soilTypes: ['Goradu Sandy Loam', 'Black Soil'], majorRiverBasin: 'Sabarmati' },
  'Rajkot': { lat: 22.3039, lng: 70.8022, elevation: 128, annualRainfall: 610, avgTempSummer: 41, avgTempWinter: 13, soilTypes: ['Medium Black Basaltic Soil'], majorRiverBasin: 'Aji' },

  // Kerala
  'Wayanad': { lat: 11.6854, lng: 76.1320, elevation: 950, annualRainfall: 2800, avgTempSummer: 29, avgTempWinter: 15, soilTypes: ['Highland Forest Loam', 'Laterite'], majorRiverBasin: 'Kabini' },
  'Palakkad': { lat: 10.7867, lng: 76.6548, elevation: 84, annualRainfall: 2100, avgTempSummer: 37, avgTempWinter: 21, soilTypes: ['Black Cotton Soil', 'Laterite'], majorRiverBasin: 'Bharathapuzha' },

  // West Bengal
  'Burdwan': { lat: 23.2324, lng: 87.8615, elevation: 30, annualRainfall: 1400, avgTempSummer: 39, avgTempWinter: 11, soilTypes: ['Gangetic Delta Alluvium'], majorRiverBasin: 'Damodar / Bhagirathi' }
};

// Reverse lookup district by coordinates
export function getNearestDistrict(lat: number, lng: number): { districtName: string; distKm: number } {
  let closestDistrict = 'Coimbatore';
  let minDistance = Infinity;

  for (const [name, data] of Object.entries(DISTRICT_COORDINATES)) {
    const dLat = (data.lat - lat) * 111; // approx km
    const dLng = (data.lng - lng) * 111 * Math.cos(lat * (Math.PI / 180));
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < minDistance) {
      minDistance = dist;
      closestDistrict = name;
    }
  }

  return { districtName: closestDistrict, distKm: Math.round(minDistance) };
}
