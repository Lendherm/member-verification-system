import L from 'leaflet';
import GeocoderService from '../services/geocoder.service.js';

// Iconos personalizados
const customIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

let map = null;
let marker = null;

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-address');
  const autoLocationButton = document.getElementById('auto-location');
  
  if (searchButton) {
    searchButton.addEventListener('click', initMap);
  }
  
  if (autoLocationButton) {
    autoLocationButton.addEventListener('click', getCurrentLocation);
  }
});

async function getCurrentLocation() {
  const button = document.getElementById('auto-location');
  const originalText = button.innerHTML;
  
  try {
    // Mostrar indicador de carga
    button.innerHTML = '<span class="location-loading"></span> Obteniendo ubicación...';
    button.disabled = true;
    
    if (!navigator.geolocation) {
      throw new Error('Tu navegador no soporta geolocalización');
    }
    
    // Obtener posición actual
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    });
    
    const { latitude, longitude } = position.coords;
    
    // Obtener dirección a partir de coordenadas (geocodificación inversa)
    const address = await reverseGeocode(latitude, longitude);
    
    // Actualizar campo de dirección
    document.getElementById('address').value = address;
    
    // Inicializar mapa si aún no está visible
    const mapContainer = document.getElementById('map-container');
    if (mapContainer.style.display === 'none') {
      await initMapWithCoords(latitude, longitude);
    } else {
      setMarker(latitude, longitude);
      map.setView([latitude, longitude], 15);
    }
    
    // Restaurar botón
    button.innerHTML = originalText;
    button.disabled = false;
    
  } catch (error) {
    console.error('Error obteniendo ubicación:', error);
    alert(`Error: ${error.message || 'No se pudo obtener tu ubicación'}`);
    
    // Restaurar botón
    button.innerHTML = originalText;
    button.disabled = false;
  }
}

async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    
    const data = await response.json();
    
    if (data && data.address) {
      // Construir dirección legible
      const { road, house_number, suburb, city, state, postcode, country } = data.address;
      
      const addressParts = [];
      if (road) addressParts.push(road);
      if (house_number) addressParts.push(house_number);
      if (suburb) addressParts.push(suburb);
      if (city) addressParts.push(city);
      if (state) addressParts.push(state);
      if (postcode) addressParts.push(postcode);
      if (country) addressParts.push(country);
      
      return addressParts.join(', ');
    }
    
    throw new Error('No se pudo obtener la dirección');
    
  } catch (error) {
    console.error('Error en geocodificación inversa:', error);
    throw new Error('No se pudo obtener la dirección para estas coordenadas');
  }
}

async function initMap() {
  const address = document.getElementById('address').value;
  
  if (!address) {
    alert('Por favor ingresa una dirección primero');
    return;
  }
  
  try {
    // Geocodificar la dirección
    const location = await GeocoderService.geocodeAddress(address);
    initMapWithCoords(location.lat, location.lon);
    
  } catch (error) {
    console.error('Error al geocodificar:', error);
    alert('No se pudo encontrar la dirección. Por favor, inténtalo de nuevo.');
  }
}

function initMapWithCoords(lat, lng) {
  // Mostrar el contenedor del mapa
  const mapContainer = document.getElementById('map-container');
  mapContainer.style.display = 'block';
  
  // Inicializar el mapa si no existe
  if (!map) {
    map = L.map('map').setView([lat, lng], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Evento para hacer clic en el mapa
    map.on('click', (e) => {
      setMarker(e.latlng.lat, e.latlng.lng);
    });
  } else {
    map.setView([lat, lng], 15);
  }
  
  // Establecer marcador inicial
  setMarker(lat, lng);
}

function setMarker(lat, lng) {
  // Eliminar marcador existente
  if (marker) {
    map.removeLayer(marker);
  }
  
  // Crear nuevo marcador
  marker = L.marker([lat, lng], {icon: customIcon, draggable: true})
    .addTo(map)
    .bindPopup('Tu ubicación seleccionada')
    .openPopup();
  
  // Actualizar campos ocultos
  document.getElementById('latitude').value = lat;
  document.getElementById('longitude').value = lng;
  
  // Permitir arrastrar el marcador
  marker.on('dragend', (e) => {
    const newPos = marker.getLatLng();
    document.getElementById('latitude').value = newPos.lat;
    document.getElementById('longitude').value = newPos.lng;
  });
}