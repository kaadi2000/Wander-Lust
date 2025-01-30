document.addEventListener("DOMContentLoaded", function() {
    let mapContainer = document.getElementById("map");
    
    if (!mapContainer) {
        console.error("Error: Map container not found! Make sure #map exists in index.html.");
        return;
    }

    let map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    fetch('/get_locations')
        .then(response => response.json())
        .then(locations => {
            locations.forEach(location => {
                let color = location.visited ? 'green' : 'red';
                L.marker([location.lat, location.lng], {
                    icon: L.divIcon({
                        className: `marker-${color}`,
                        html: `<div style='background:${color}; width:10px; height:10px; border-radius:50%;'></div>`
                    })
                }).addTo(map).bindPopup(`<b>${location.name}</b><br>${location.notes}`);
            });
        });

    let themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", function() {
            document.body.classList.toggle("dark-mode");
        });
    }
});
