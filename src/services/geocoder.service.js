// src/services/geocoder.service.js

import axios from 'axios';

class GeocoderService {
  constructor() {
    this.cache = new Map();
  }

  async geocodeAddress(address) {
    if (this.cache.has(address)) {
      return this.cache.get(address);
    }

    try {
      // Usando Nominatim (OpenStreetMap)
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );

      if (response.data && response.data.length > 0) {
        const result = {
          lat: parseFloat(response.data[0].lat),
          lon: parseFloat(response.data[0].lon),
          displayName: response.data[0].display_name
        };
        
        this.cache.set(address, result);
        return result;
      }

      throw new Error('Address not found');
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  async reverseGeocode(lat, lon) {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );

      if (response.data && response.data.address) {
        const address = response.data.address;
        
        // Construir dirección legible
        const parts = [
          address.road,
          address.house_number,
          address.suburb,
          address.city,
          address.state,
          address.postcode,
          address.country
        ].filter(Boolean);

        return parts.join(', ');
      }

      throw new Error('Address not found');
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }
}

export default new GeocoderService();
