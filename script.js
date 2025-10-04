// Initialize map
const map = L.map('map').setView([20, 0], 2);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// DOM elements
const cityInput = document.getElementById('cityName');
const photoInput = document.getElementById('photoInput');
const photoText = document.getElementById('photoText');
const addBtn = document.getElementById('addBtn');
const cityCount = document.getElementById('cityCount');

// Predefined city coordinates (offline)
const cityCoordinates = {
  "Paris": { lat: 48.8566, lon: 2.3522 },
  "London": { lat: 51.5074, lon: -0.1278 },
  "New York": { lat: 40.7128, lon: -74.0060 },
  "Tokyo": { lat: 35.6895, lon: 139.6917 },
  "Delhi": { lat: 28.6139, lon: 77.2090 },
  "Sydney": { lat: -33.8688, lon: 151.2093 },
  "Rome": { lat: 41.9028, lon: 12.4964 },
  "Dubai": { lat: 25.276987, lon: 55.296249 }
  // Add more cities as needed
};

// Load saved cities from localStorage
let cities = JSON.parse(localStorage.getItem('travelCities') || '[]');

// Function to add marker
function addMarkerOffline(cityName, text, imgSrc) {
  const coords = cityCoordinates[cityName];
  if (!coords) return alert("City not found in offline map!");

  const marker = L.marker([coords.lat, coords.lon]).addTo(map);
  marker.bindPopup(`<b>${cityName}</b><br>${text}<br><img src="${imgSrc}" width="150px" style="border-radius:10px;">`);

  // Save to array and localStorage
  cities.push({ cityName, text, imgSrc });
  localStorage.setItem('travelCities', JSON.stringify(cities));
  updateStats();
}

// Update stats
function updateStats() {
  cityCount.textContent = `Visited ${cities.length} cities.`;
}

// Add marker from form
addBtn.addEventListener('click', () => {
  const cityName = cityInput.value.trim();
  const text = photoText.value.trim();
  const file = photoInput.files[0];
  if (!cityName || !file) return alert("Please provide city and photo!");

  const reader = new FileReader();
  reader.onload = function() {
    const imgSrc = reader.result;
    addMarkerOffline(cityName, text, imgSrc);

    // Clear form
    cityInput.value = '';
    photoInput.value = '';
    photoText.value = '';
  }
  reader.readAsDataURL(file);
});

// Load saved markers on page load
cities.forEach(item => addMarkerOffline(item.cityName, item.text, item.imgSrc));
