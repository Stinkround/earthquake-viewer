const urlParams = new URLSearchParams(window.location.search);
const param1Value = urlParams.get("id");

function getColor(magnitude) {
  const ratio = magnitude / 10;
  const red = Math.round(255 * ratio);
  const green = Math.round(255 * (1 - ratio));
  return `rgb(${red}, ${green}, 0)`;
}

async function displayEarthquakeData() {
  const response = await fetch(
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=1&eventid=${param1Value}`
  );

  const data = await response.json();

  let magnitude = parseFloat(data.properties.mag.toFixed(3));
  let elocation = data.properties.place;
  let time = new Date(data.properties.time).toLocaleString();
  let depth = parseFloat(data.geometry.coordinates[2].toFixed(3));
  let longitude = data.geometry.coordinates[0];
  let latitude = data.geometry.coordinates[1];

  var map = L.map("map").setView([latitude, longitude], 13);
  var marker = L.geoJSON(data).addTo(map);

  marker
    .bindPopup(
      `


<h2>Earthquake</h2>
<h5>${param1Value}</h5>

<p>Magnitude: <span style="color: ${getColor(
        magnitude
      )};">${magnitude}</span></p>
<p>Location: ${elocation}</p>
<p>Time: ${time}</p>
<p>Depth: ${depth} km</p> 



`
    )
    .openPopup();

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

displayEarthquakeData();

document.addEventListener("keydown", (e) => {
  if (e.key === "Backspace") {
    window.close();
  }
});
