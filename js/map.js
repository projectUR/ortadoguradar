/* =========================================
   Orta Doğu Radar - Map System (Rasathane)
   ========================================= */

let radarMap = null;
let mapMarkers = [];
let mapInitialized = false;

// We expose this function globally so app.js can call it when data arrives
window.initMap = function(newsData) {
    if (mapInitialized) {
        updateMapMarkers(newsData);
        return;
    }

    // Initialize Map - Center roughly on Middle East (Lat: 31, Lng: 36)
    radarMap = L.map('leafletMap', {
        zoomControl: false // Custom position if needed, or hide
    }).setView([31.5, 36.5], 5);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(radarMap);

    // Dark Theme Base Map (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(radarMap);

    mapInitialized = true;
    updateMapMarkers(newsData);
};

// Expose map resize functionality (for when tab switches)
window.invalidateMapSize = function() {
    if (radarMap) {
        setTimeout(() => {
            radarMap.invalidateSize();
        }, 100); // slight delay to allow CSS transitions to finish before recalculating
    }
};

function updateMapMarkers(newsData) {
    if (!radarMap) return;

    // Clear existing markers
    mapMarkers.forEach(marker => radarMap.removeLayer(marker));
    mapMarkers = [];

    const now = new Date();

    newsData.forEach(item => {
        if (!item.location || !item.location.lat || !item.location.lng) return;

        // Calculate age
        const newsDate = new Date(item.timestamp);
        const diffHours = (now - newsDate) / (1000 * 60 * 60);

        // Determine color class based on recency logic requested by user
        let dotColor = 'blue'; // default >= 12h
        if (diffHours < 6) {
            dotColor = 'red';
        } else if (diffHours < 12) {
            dotColor = 'green';
        }

        // Create Custom HTML Icon (pulse)
        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="pulse-marker dot ${dotColor}"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

                const jitterLat = item.location.lat + (Math.random() - 0.5) * 0.3;
        const jitterLng = item.location.lng + (Math.random() - 0.5) * 0.3;
        
        const marker = L.marker([jitterLat, jitterLng], {

            icon: customIcon
        }).addTo(radarMap);

        // Map Popup construction
        const popupContent = `
            <div class="custom-popup">
                <h4><i class="fa-solid fa-map-pin"></i> ${item.location.name}</h4>
                <p><strong>${item.title}</strong></p>
                <div style="margin-top: 8px; font-size: 0.8rem; color: #94a3b8;">
                    ${formatTimeAgo(newsDate)} • <a href="${item.source}" target="_blank" style="color: #3b82f6;">Kaynağa Git</a>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent);
        mapMarkers.push(marker);
    });
}

// Minimal helper to format time inside map popup (kept independent just in case)
function formatTimeAgo(date) {
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return `${diff} saniye önce`;
    const min = Math.floor(diff / 60);
    if (min < 60) return `${min} dakika önce`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} saat önce`;
    return `${Math.floor(hr / 24)} gün önce`;
}
