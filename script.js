let lastQuakeId = null;
let openedOn = new Date().toISOString();
let ids = [];

import { magnitudeColor } from "./GetColor.js";

function processEarthquakeData(earthquakeData) {
  let result = [];

  earthquakeData.forEach((feature) => {
    if (!ids.includes(feature.id)) {
      ids.push(feature.id);
      let earthquake = {
        id: feature.id,
        magnitude: parseFloat(feature.properties.mag.toFixed(3)),
        location: feature.properties.place,
        time: new Date(feature.properties.time).toLocaleString(),
        depth: parseFloat(feature.geometry.coordinates[2].toFixed(3)),
      };
      result.push(earthquake);
    }
  });
  return result;
}

function addData(earthquake) {
  earthquake.forEach((earthquake) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add("div");
    newDiv.id = earthquake.id;

    // Add the animation to the div

    if (earthquake.magnitude < 5) {
    } else if (earthquake.magnitude < 7) {
      newDiv.style.animation = `radiateYellow 2s 3`;
    } else {
      newDiv.style.animation = `$radiateRed 2s 3`;
    }

    newDiv.innerHTML = `
  <h2 style="text-decoration: underline; cursor: pointer;" onclick="window.open('/map/map.html?id=${
    earthquake.id
  }')">Earthquake</h2>
  <h5>${earthquake.id}</h5>

  <p>Magnitude: <span style="color: ${magnitudeColor(earthquake.magnitude)};">${
      earthquake.magnitude
    }</span></p>
  <p>Location: ${earthquake.location}</p>
  <p>Time: ${earthquake.time}</p>
  <p>Depth: ${earthquake.depth} km</p> 


  `;

    document.getElementById("earthquakeContent").appendChild(newDiv);
    document
      .getElementById("earthquakeContent")
      .appendChild(document.createElement("br"));
  });
}

async function displayEarthquakeData() {
  let response = await fetch(
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${openedOn}`
  );
  let data = await response.json();
  if (
    data.features.length === 0 &&
    document.getElementById("earthquakeContent").children.length === 0
  ) {
    response = await fetch(
      `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=1`
    );
    data = await response.json();
  }

  addData(processEarthquakeData(data.features));
}

function clearEarthquakes() {
  const earthquakeContent = document.getElementById("earthquakeContent");
  while (earthquakeContent.children.length > 1) {
    earthquakeContent.removeChild(earthquakeContent.children[0]);
  }
}

// Add this event listener
document
  .getElementById("clearButton")
  .addEventListener("click", clearEarthquakes);

// Display earthquake data immediately and then every 5 minutes
displayEarthquakeData();

// Countdown timer
let countdown = 90;
const countdownDiv = document.getElementById("countdown");

setInterval(() => {
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  countdownDiv.innerText = `Updating in ${minutes} minutes and ${seconds} seconds...`;

  countdown--;

  if (countdown < 0) {
    countdown = 90;
    displayEarthquakeData();
  }
}, 1000);
