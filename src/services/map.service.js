import L from 'leaflet';

class MapService {
  initMap(containerId, center = [51.505, -0.09], zoom = 13) {
    const map = L.map(containerId).setView(center, zoom);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return map;
  }

  addMemberMarkers(map, members) {
    const verifiedIcon = L.icon({
      iconUrl: '/images/verified-marker.png',
      iconSize: [32, 32]
    });

    const pendingIcon = L.icon({
      iconUrl: '/images/pending-marker.png',
      iconSize: [32, 32]
    });

    members.forEach(member => {
      const marker = L.marker(
        [member.location.lat, member.location.lon],
        { icon: member.status === 'verified' ? verifiedIcon : pendingIcon }
      ).addTo(map);

      marker.bindPopup(`
        <h3>${member.name}</h3>
        <p>${member.address}</p>
        <p>Status: <strong>${member.status}</strong></p>
        ${member.status === 'verified' 
          ? `<p>Verified on: ${new Date(member.verifiedAt).toLocaleDateString()}</p>`
          : '<button class="verify-btn" data-id="${member.id}">Verify</button>'}
      `);
    });
  }
}

export default new MapService();