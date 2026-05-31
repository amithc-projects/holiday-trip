/* app.js - Interactive Leaflet Map & Timeline Sync */

// Coordinates database for itinerary locations with Wikipedia articles and images
const LOCATIONS = {
  london: { 
    coords: [51.5074, -0.1278], 
    name: "London, UK", 
    desc: "Departure & Return point",
    wiki: "https://en.wikipedia.org/wiki/London"
  },
  tbilisi: { 
    coords: [41.7151, 44.8271], 
    name: "Tbilisi, Georgia", 
    desc: "Base for Days 1-6 & Day 10",
    img: "/images/tbilisi.png",
    wiki: "https://en.wikipedia.org/wiki/Tbilisi"
  },
  mtskheta: { 
    coords: [41.8423, 44.7162], 
    name: "Mtskheta, Georgia", 
    desc: "Jvari Monastery & Svetitskhoveli",
    wiki: "https://en.wikipedia.org/wiki/Mtskheta"
  },
  uplistsikhe: { 
    coords: [41.9615, 44.2081], 
    name: "Uplistsikhe & Gori, Georgia", 
    desc: "Ancient Cave Town & Stalin Museum",
    wiki: "https://en.wikipedia.org/wiki/Uplistsikhe"
  },
  armenia_border: { 
    coords: [41.2223, 44.8329], 
    name: "Sadakhlo Border Crossing", 
    desc: "Georgia-Armenia border control",
    wiki: "https://en.wikipedia.org/wiki/Sadakhlo"
  },
  haghpat: { 
    coords: [41.0938, 44.7120], 
    name: "Haghpat Monastery, Armenia", 
    desc: "UNESCO World Heritage site in Debed Canyon",
    img: "/images/armenia.png",
    wiki: "https://en.wikipedia.org/wiki/Haghpat_Monastery"
  },
  sanahin: { 
    coords: [41.0872, 44.6821], 
    name: "Sanahin Monastery, Armenia", 
    desc: "Ancient medieval school & library",
    img: "/images/armenia.png",
    wiki: "https://en.wikipedia.org/wiki/Sanahin_Monastery"
  },
  ananuri: { 
    coords: [42.1633, 44.7025], 
    name: "Ananuri Fortress, Georgia", 
    desc: "Scenic complex on the Aragvi River",
    wiki: "https://en.wikipedia.org/wiki/Ananuri"
  },
  gudauri: { 
    coords: [42.4925, 44.4719], 
    name: "Friendship Monument, Gudauri", 
    desc: "Soviet-Georgian Friendship view",
    wiki: "https://en.wikipedia.org/wiki/Russia%E2%80%93Georgia_Friendship_Monument"
  },
  kazbegi: { 
    coords: [42.6593, 44.6433], 
    name: "Stepantsminda (Kazbegi), Georgia", 
    desc: "Gergeti Trinity Church base (Days 7-9)",
    img: "/images/kazbegi.png",
    wiki: "https://en.wikipedia.org/wiki/Stepantsminda"
  },
  juta: { 
    coords: [42.5786, 44.7431], 
    name: "Juta Valley, Georgia", 
    desc: "Dramatic mountain hikes",
    wiki: "https://en.wikipedia.org/wiki/Juta,_Georgia"
  },
  baku: { 
    coords: [40.4093, 49.8671], 
    name: "Baku, Azerbaijan", 
    desc: "Caspian Sea Base (Days 10-14)",
    img: "/images/baku.png",
    wiki: "https://en.wikipedia.org/wiki/Baku"
  },
  absheron: { 
    coords: [40.4522, 50.0089], 
    name: "Ateshgah & Yanar Dag, Azerbaijan", 
    desc: "Fire Temple & Burning Mountain",
    wiki: "https://en.wikipedia.org/wiki/Ateshgah_of_Baku"
  },
  gobustan: { 
    coords: [40.1167, 49.3833], 
    name: "Gobustan Mud Volcanoes", 
    desc: "Unusual mud craters & rock art",
    wiki: "https://en.wikipedia.org/wiki/Gobustan_National_Park"
  }
};

// Route mapping for each day
const DAY_LOCATIONS = {
  1: ["london", "tbilisi"],
  2: ["tbilisi"],
  3: ["tbilisi", "mtskheta"],
  4: ["tbilisi", "uplistsikhe"],
  5: ["tbilisi", "armenia_border", "haghpat", "sanahin"],
  6: ["tbilisi"],
  7: ["tbilisi", "ananuri", "gudauri", "kazbegi"],
  8: ["kazbegi"],
  9: ["kazbegi", "juta"],
  10: ["kazbegi", "tbilisi", "baku"],
  11: ["baku"],
  12: ["baku", "absheron"],
  13: ["baku", "gobustan"],
  14: ["baku", "london"]
};

let map;
let markers = {};
let flightLines = [];
let roadLines = [];

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  initTimelineSync();
});

function initMap() {
  // Initialize map centered roughly between London and Baku
  map = L.map("map-container", {
    center: [44.0, 24.0],
    zoom: 4,
    zoomControl: false,
    minZoom: 3,
    maxZoom: 14
  });

  // Position zoom control in top-right
  L.control.zoom({ position: "topright" }).addTo(map);

  // CartoDB Dark Matter Tile Layer (Matches premium dark theme)
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20
  }).addTo(map);

  // Add markers
  Object.keys(LOCATIONS).forEach(key => {
    const loc = LOCATIONS[key];
    const el = document.createElement("div");
    el.className = "custom-marker";
    el.innerHTML = key === "london" ? "L" : key === "baku" ? "B" : key === "tbilisi" ? "T" : "•";

    const icon = L.divIcon({
      html: el,
      className: "custom-div-icon",
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker(loc.coords, { icon: icon }).addTo(map);
    
    // Construct popup HTML with image and Wikipedia link
    let popupHTML = `<div class="map-popup-content" style="max-width: 250px;">`;
    popupHTML += `<h4>${loc.name}</h4>`;
    popupHTML += `<p style="margin-bottom: 8px;">${loc.desc}</p>`;
    
    if (loc.img) {
      popupHTML += `<img src="${loc.img}" alt="${loc.name}" style="width:100%; height:130px; object-fit:cover; border-radius:6px; margin-bottom:8px; display:block;" />`;
    }
    
    if (loc.wiki) {
      popupHTML += `<a href="${loc.wiki}" target="_blank" class="popup-wiki-link" style="color:#F59E0B; text-decoration:none; font-size:11px; font-weight:600; display:inline-flex; align-items:center; gap:4px;">Read Wikipedia <span class="material-symbols-outlined" style="font-size:12px;">open_in_new</span></a>`;
    }
    
    popupHTML += `</div>`;
    
    marker.bindPopup(popupHTML);

    markers[key] = marker;
  });

  // Plot flight paths (Arched/Dashed paths)
  drawFlightPath(LOCATIONS.london.coords, LOCATIONS.tbilisi.coords, "London ➔ Tbilisi (BA Direct Flight)");
  drawFlightPath(LOCATIONS.tbilisi.coords, LOCATIONS.baku.coords, "Tbilisi ➔ Baku (AZAL Flight)");
  drawFlightPath(LOCATIONS.baku.coords, LOCATIONS.london.coords, "Baku ➔ London (AZAL Direct Flight)");

  // Plot road connections
  drawRoadPath([
    LOCATIONS.tbilisi.coords,
    LOCATIONS.mtskheta.coords
  ], "Mtskheta Excursion");

  drawRoadPath([
    LOCATIONS.tbilisi.coords,
    LOCATIONS.uplistsikhe.coords
  ], "Uplistsikhe/Gori Excursion");

  drawRoadPath([
    LOCATIONS.tbilisi.coords,
    LOCATIONS.armenia_border.coords,
    LOCATIONS.haghpat.coords,
    LOCATIONS.sanahin.coords,
    LOCATIONS.armenia_border.coords,
    LOCATIONS.tbilisi.coords
  ], "Armenia Monasteries Excursion");

  drawRoadPath([
    LOCATIONS.tbilisi.coords,
    LOCATIONS.ananuri.coords,
    LOCATIONS.gudauri.coords,
    LOCATIONS.kazbegi.coords
  ], "Military Highway to Kazbegi");

  drawRoadPath([
    LOCATIONS.kazbegi.coords,
    LOCATIONS.juta.coords
  ], "Juta Valley Hike");

  drawRoadPath([
    LOCATIONS.baku.coords,
    LOCATIONS.absheron.coords
  ], "Absheron Fire Tour");

  drawRoadPath([
    LOCATIONS.baku.coords,
    LOCATIONS.gobustan.coords
  ], "Gobustan Mud Volcanoes");
}

// Draw arched flight paths using Bezier approximation
function drawFlightPath(start, end, label) {
  // Simple mid point calculation with curvature offset
  const lat1 = start[0], lon1 = start[1];
  const lat2 = end[0], lon2 = end[1];
  
  const midLat = (lat1 + lat2) / 2 + (lon2 - lon1) * 0.15;
  const midLon = (lon1 + lon2) / 2 - (lat2 - lat1) * 0.15;
  
  const points = [];
  // Quadratic bezier curve approximation
  for (let t = 0; t <= 1; t += 0.05) {
    const x = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * midLat + t * t * lat2;
    const y = (1 - t) * (1 - t) * lon1 + 2 * (1 - t) * t * midLon + t * t * lon2;
    points.push([x, y]);
  }

  const polyline = L.polyline(points, {
    color: "#F59E0B",
    weight: 2,
    dashArray: "6, 8",
    opacity: 0.75
  }).addTo(map);

  polyline.bindTooltip(label, { sticky: true, className: "map-path-tooltip" });
  flightLines.push(polyline);
}

// Draw solid driving roads
function drawRoadPath(latlngs, label) {
  const polyline = L.polyline(latlngs, {
    color: "#3B82F6",
    weight: 3,
    opacity: 0.6
  }).addTo(map);

  polyline.bindTooltip(label, { sticky: true, className: "map-path-tooltip" });
  roadLines.push(polyline);
}

function initTimelineSync() {
  const dayElements = document.querySelectorAll(".timeline-day");

  dayElements.forEach(dayEl => {
    dayEl.addEventListener("click", () => {
      // Remove active class from all days
      dayElements.forEach(el => el.classList.remove("active"));
      // Add active to current
      dayEl.classList.add("active");

      const dayNum = parseInt(dayEl.getAttribute("data-day"), 10);
      focusOnDayLocations(dayNum);
    });
  });

  // Set first day as active initially
  if (dayElements.length > 0) {
    dayElements[0].classList.add("active");
  }
}

function focusOnDayLocations(dayNum) {
  const locKeys = DAY_LOCATIONS[dayNum];
  if (!locKeys || locKeys.length === 0) return;

  // Clear previous active custom styling
  document.querySelectorAll(".custom-marker").forEach(el => {
    el.classList.remove("active");
  });

  // Extract coordinates for current day
  const coordsList = locKeys.map(key => {
    const m = markers[key];
    if (m) {
      const el = m.getElement();
      if (el) {
        el.querySelector(".custom-marker").classList.add("active");
      }
    }
    return LOCATIONS[key].coords;
  });

  if (coordsList.length === 1) {
    // Single location: center and zoom in
    const primaryKey = locKeys[0];
    map.setView(coordsList[0], 9, { animate: true, duration: 1.2 });
    setTimeout(() => {
      markers[primaryKey].openPopup();
    }, 400);
  } else {
    // Multiple locations: fit bounds nicely
    const bounds = L.latLngBounds(coordsList);
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 9,
      animate: true,
      duration: 1.2
    });
    
    // Open popup on the primary/main destination of that day
    const mainKey = locKeys[locKeys.length - 1]; // pick the last destination/stay base
    setTimeout(() => {
      markers[mainKey].openPopup();
    }, 600);
  }
}

// Wikipedia Modal Intercept Logic
document.addEventListener("DOMContentLoaded", () => {
  initWikiModal();
});

function initWikiModal() {
  const modal = document.getElementById("wiki-modal");
  const closeBtn = document.getElementById("wiki-modal-close");
  const modalBody = document.getElementById("wiki-modal-body");

  if (!modal || !closeBtn || !modalBody) return;

  // Intercept Wikipedia links on the entire page (timeline & leaflet popups)
  document.addEventListener("click", (e) => {
    const targetLink = e.target.closest("a");
    if (!targetLink) return;

    const href = targetLink.getAttribute("href") || "";
    if (href.includes("wikipedia.org/wiki/")) {
      e.preventDefault();
      
      // Extract title from URL
      const parts = href.split("/wiki/");
      const rawTitle = parts[parts.length - 1];
      const title = decodeURIComponent(rawTitle.split("?")[0].split("#")[0]);

      openWikiModal(title, href);
    }
  });

  // Close modal when clicking close button
  closeBtn.addEventListener("click", closeWikiModal);

  // Close modal when clicking overlay (outside modal content)
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeWikiModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeWikiModal();
    }
  });
}

async function openWikiModal(title, originalUrl) {
  const modal = document.getElementById("wiki-modal");
  const modalBody = document.getElementById("wiki-modal-body");

  if (!modal || !modalBody) return;

  // Show modal in loading state
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  
  modalBody.innerHTML = `
    <div class="wiki-loading">
      <div class="spinner"></div>
      <p>Fetching article summary...</p>
    </div>
  `;

  // Format title for fallback display
  const displayTitle = title.replace(/_/g, " ");

  try {
    // Call Wikipedia REST API for page summary
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Wikipedia page summary: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Construct modal body HTML
    let bodyHTML = `<h3 class="wiki-modal-title">${data.title || displayTitle}</h3>`;
    
    if (data.thumbnail && data.thumbnail.source) {
      bodyHTML += `<img src="${data.thumbnail.source}" class="wiki-modal-img" alt="${data.title}" />`;
    }
    
    bodyHTML += `<p class="wiki-modal-extract">${data.extract || "No summary available."}</p>`;
    bodyHTML += `<a href="${originalUrl}" target="_blank" class="wiki-modal-cta">
      Read Full Article
      <span class="material-symbols-outlined" style="font-size:16px;">open_in_new</span>
    </a>`;
    
    modalBody.innerHTML = bodyHTML;
  } catch (error) {
    console.error("Error loading Wikipedia preview:", error);
    
    // Render error state with a link to fallback opening in new tab
    modalBody.innerHTML = `
      <div class="wiki-error">
        <span class="material-symbols-outlined wiki-error-icon" style="font-size:48px; color:#EF4444; margin-bottom:12px;">error</span>
        <p style="margin-bottom:20px;">Could not fetch article summary from Wikipedia.</p>
        <a href="${originalUrl}" target="_blank" class="wiki-modal-cta">
          Open in New Tab
          <span class="material-symbols-outlined" style="font-size:16px;">open_in_new</span>
        </a>
      </div>
    `;
  }
}

function closeWikiModal() {
  const modal = document.getElementById("wiki-modal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
