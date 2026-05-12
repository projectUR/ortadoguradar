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
// Expose map resize functionality (for when tab switches)
window.invalidateMapSize = function () {
    if (radarMap) {
        // Harita container'ının CSS ile görünür olduğundan emin olmak için 
        // 10 milisaniye bekleyip Leaflet motorunu "Kendine gel ve yeniden boyutlan" diyerek uyandırıyoruz.
        setTimeout(() => {
            radarMap.invalidateSize();
            // Mobil cihazlarda ekran yüksekliğine göre merkezi yeniden hizalamak istersen:
            radarMap.setView(radarMap.getCenter(), radarMap.getZoom(), { animate: false });
        }, 10);
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
        let dotColor = 'blue'; // default >= 24h or extremely old

        if (diffHours >= 0 && diffHours <= 6) {
            dotColor = 'red';   // 0-6 hours (HOT)
        } else if (diffHours > 6 && diffHours <= 12) {
            dotColor = 'green'; // 6-12 hours (WARM)
        } else if (diffHours > 12 && diffHours <= 24) {
            dotColor = 'blue';  // 12-24 hours (COLD)
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
        marker.itemData = item;

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
// Dışarıdan gelen tıklamalarla haritayı ilgili habere odaklar
window.focusMapOnItem = function(itemId) {
    if (!radarMap || !mapMarkers) return;
    
    const targetMarker = mapMarkers.find(m => m.itemData && m.itemData.id === itemId);
    if (targetMarker) {
        if (typeof window.switchView === 'function') {
            window.switchView('map');
        }
        
        radarMap.flyTo(targetMarker.getLatLng(), 6, {
            animate: true,
            duration: 1.5
        });
        
        setTimeout(() => {
            targetMarker.openPopup();
        }, 500);
    }
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
