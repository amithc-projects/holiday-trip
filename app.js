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
    wiki: "https://en.wikipedia.org/wiki/Tbilisi",
    booking: "https://www.booking.com/searchresults.html?ss=Tbilisi&amp;checkin=2026-09-03&amp;checkout=2026-09-09&amp;group_adults=4&amp;no_rooms=4",
    airbnb: "https://www.airbnb.com/s/Tbilisi--Georgia/homes?tab_id=home_tab&amp;checkin=2026-09-03&amp;checkout=2026-09-09&amp;adults=4&amp;min_bedrooms=4"
  },
  mtskheta: { 
    coords: [41.8423, 44.7162], 
    name: "Mtskheta, Georgia", 
    desc: "Jvari Monastery & Svetitskhoveli",
    wiki: "https://en.wikipedia.org/wiki/Mtskheta"
  },
  uplistsikhe: { 
    coords: [41.9615, 44.2081], 
    name: "Uplistsikhe Cave Town, Georgia", 
    desc: "Ancient rock-hewn town dating back to the Early Iron Age",
    wiki: "https://en.wikipedia.org/wiki/Uplistsikhe"
  },
  gori_fortress: {
    coords: [41.9868, 44.1157],
    name: "Gori Fortress, Georgia",
    desc: "Medieval citadel on a rocky hill in the center of Gori, offering panoramic views",
    wiki: "https://en.wikipedia.org/wiki/Gori_Fortress"
  },
  war_heroes_memorial: {
    coords: [41.9859, 44.1152],
    name: "Memorial of Georgian War Heroes, Gori",
    desc: "A striking circular arrangement of large bronze warrior statues at the foot of the fortress",
    wiki: "https://en.wikipedia.org/wiki/Memorial_of_Georgian_War_Heroes"
  },
  ateni_sioni: {
    coords: [41.9048, 44.0961],
    name: "Ateni Sioni Church, Georgia",
    desc: "7th-century church with expressive stone carvings, located in a scenic wine-valley south of Gori",
    wiki: "https://en.wikipedia.org/wiki/Ateni_Sioni_Church"
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
    wiki: "https://en.wikipedia.org/wiki/Stepantsminda",
    booking: "https://www.booking.com/searchresults.html?ss=Stepantsminda&amp;checkin=2026-09-09&amp;checkout=2026-09-12&amp;group_adults=4&amp;no_rooms=4",
    airbnb: "https://www.airbnb.com/s/Stepantsminda--Georgia/homes?tab_id=home_tab&amp;checkin=2026-09-09&amp;checkout=2026-09-12&amp;adults=4&amp;min_bedrooms=4"
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
    wiki: "https://en.wikipedia.org/wiki/Baku",
    booking: "https://www.booking.com/searchresults.html?ss=Baku&amp;checkin=2026-09-12&amp;checkout=2026-09-16&amp;group_adults=4&amp;no_rooms=4",
    airbnb: "https://www.airbnb.com/s/Baku--Azerbaijan/homes?tab_id=home_tab&amp;checkin=2026-09-12&amp;checkout=2026-09-16&amp;adults=4&amp;min_bedrooms=4"
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
  4: ["tbilisi", "uplistsikhe", "gori_fortress", "war_heroes_memorial", "ateni_sioni"],
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

  // Esri World Dark Gray Canvas Basemap (Forces clean English labels)
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
    maxZoom: 16
  }).addTo(map);

  // Esri World Dark Gray Reference Layer (Transparent labels on top)
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
    attribution: '',
    maxZoom: 16
  }).addTo(map);


  // Add markers
  Object.keys(LOCATIONS).forEach(key => {
    const loc = LOCATIONS[key];
    const el = document.createElement("div");
    const isBase = ["tbilisi", "kazbegi", "baku"].includes(key);

    if (isBase) {
      el.className = "custom-marker base-marker";
      el.innerHTML = `<span class="material-symbols-outlined" style="font-size: 14px; font-weight: bold; display: flex; align-items: center; justify-content: center;">home</span>`;
    } else {
      el.className = "custom-marker stopover-marker";
      el.innerHTML = key === "london" ? "L" : "•";
    }

    const icon = L.divIcon({
      html: el,
      className: "custom-div-icon",
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    const marker = L.marker(loc.coords, { icon: icon }).addTo(map);
    
    if (isBase) {
      const nightsText = key === "tbilisi" ? "6 Nights" : key === "kazbegi" ? "3 Nights" : "4 Nights";
      marker.bindTooltip(
        `<div style="font-weight: 700; color: #F59E0B; text-transform: uppercase; font-size: 9px; letter-spacing: 0.5px;">Stay Base</div>
         <div style="font-size: 11px; font-weight: 600;">${loc.name.split(',')[0]}</div>
         <div style="color: #94A3B8; font-size: 10px; margin-top: 1px;">${nightsText}</div>`,
        {
          permanent: true,
          direction: "top",
          offset: [0, -15],
          className: "leaflet-base-tooltip"
        }
      );
    }
    
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

    if (loc.booking || loc.airbnb) {
      popupHTML += `<div style="margin-top: 10px; border-top: 1px solid var(--border-color); padding-top: 8px; display: flex; flex-direction: column; gap: 4px;">`;
      popupHTML += `<div style="font-size: 10px; color: #94A3B8; font-weight: 600; text-transform: uppercase;">Accommodation Stays:</div>`;
      popupHTML += `<div style="display: flex; gap: 8px;">`;
      if (loc.booking) {
        popupHTML += `<a href="${loc.booking}" target="_blank" style="color:#3B82F6; text-decoration:none; font-size:11px; font-weight:600; display:inline-flex; align-items:center; gap:2px;">Booking.com <span class="material-symbols-outlined" style="font-size:10px;">open_in_new</span></a>`;
      }
      if (loc.booking && loc.airbnb) {
        popupHTML += `<span style="color:#475569; font-size:11px;">|</span>`;
      }
      if (loc.airbnb) {
        popupHTML += `<a href="${loc.airbnb}" target="_blank" style="color:#F59E0B; text-decoration:none; font-size:11px; font-weight:600; display:inline-flex; align-items:center; gap:2px;">Airbnb <span class="material-symbols-outlined" style="font-size:10px;">open_in_new</span></a>`;
      }
      popupHTML += `</div>`;
      popupHTML += `</div>`;
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
    LOCATIONS.uplistsikhe.coords,
    LOCATIONS.gori_fortress.coords,
    LOCATIONS.war_heroes_memorial.coords,
    LOCATIONS.ateni_sioni.coords,
    LOCATIONS.tbilisi.coords
  ], "Uplistsikhe & Gori Excursion");

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
  initWebChat();
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

function initWebChat() {
  const widget = document.getElementById("chat-widget");
  const trigger = document.getElementById("chat-trigger");
  const windowEl = document.getElementById("chat-window");
  const closeBtn = document.getElementById("chat-close-btn");
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send-btn");
  const messagesContainer = document.getElementById("chat-messages");
  const suggestions = document.querySelectorAll(".chat-suggestion-pill");

  if (!widget || !trigger || !windowEl || !closeBtn || !input || !sendBtn || !messagesContainer) return;

  // Toggle chat window
  trigger.addEventListener("click", () => {
    const isOpen = windowEl.classList.contains("open");
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  });

  closeBtn.addEventListener("click", closeChat);

  function openChat() {
    windowEl.classList.add("open");
    windowEl.setAttribute("aria-hidden", "false");
    trigger.style.transform = "scale(0) rotate(180deg)";
    setTimeout(() => {
      input.focus();
    }, 300);
  }

  function closeChat() {
    windowEl.classList.remove("open");
    windowEl.setAttribute("aria-hidden", "true");
    trigger.style.transform = "scale(1) rotate(0)";
  }

  // Handle Send Message
  sendBtn.addEventListener("click", handleUserSend);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleUserSend();
  });

  // Handle Suggestions Click
  suggestions.forEach(pill => {
    pill.addEventListener("click", () => {
      const q = pill.getAttribute("data-question");
      sendUserMessage(q);
    });
  });

  function handleUserSend() {
    const text = input.value.trim();
    if (!text) return;
    sendUserMessage(text);
    input.value = "";
  }

  function sendUserMessage(text) {
    // Append user message
    appendMessage(text, "outgoing");
    
    // Auto scroll
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Show typing indicator
    showTypingIndicator();

    // Generate reply after brief organic delay
    setTimeout(() => {
      removeTypingIndicator();
      const reply = generateChatbotReply(text);
      appendMessage(reply, "incoming");
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
  }

  function appendMessage(text, direction) {
    const msg = document.createElement("div");
    msg.className = `chat-message ${direction}`;
    msg.innerHTML = text;
    messagesContainer.appendChild(msg);
  }

  let typingIndicatorEl = null;

  function showTypingIndicator() {
    if (typingIndicatorEl) return;
    const msg = document.createElement("div");
    msg.className = "chat-message incoming";
    msg.id = "chat-typing-indicator";
    msg.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    messagesContainer.appendChild(msg);
    typingIndicatorEl = msg;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function removeTypingIndicator() {
    if (typingIndicatorEl) {
      typingIndicatorEl.remove();
      typingIndicatorEl = null;
    }
  }

  function generateChatbotReply(text) {
    const q = text.toLowerCase();

    if (q.includes("visa") || q.includes("passport") || q.includes("border") || q.includes("entry") || q.includes("sadakhlo") || q.includes("asan")) {
      return "For UK passport holders:<br/>• **Georgia:** Visa-free for up to 1 year.<br/>• **Armenia:** Visa-free for up to 180 days.<br/>• **Azerbaijan:** **ASAN e-Visa is REQUIRED.** Apply online 1-2 weeks prior ($26, takes 3 business days).<br/>• **Armenia Excursion:** The Sadakhlo border is crossed by road; we recommend an organized tour to handle border control smoothly.";
    }
    
    if (q.includes("hotel") || q.includes("stay") || q.includes("accommodation") || q.includes("airbnb") || q.includes("booking") || q.includes("apartment") || q.includes("budget") || q.includes("bedroom") || q.includes("cost") || q.includes("price")) {
      return "We have selected three curated 4-bedroom apartments/chalets (since you are 4 adults wanting separate bedrooms):<br/>1. **Tbilisi:** Vera Luxury Penthouse (~£240/night, 6 nights).<br/>2. **Kazbegi:** Kazbegi Mountain Chalet (~£310/night, 3 nights).<br/>3. **Baku:** Nizami Street Duplex (~£280/night, 4 nights).<br/>• **Budget Check:** The total cost stays well below your £125 per person per night limit (£500/night total group budget).";
    }

    if (q.includes("flight") || q.includes("plane") || q.includes("airline") || q.includes("airport") || q.includes("direct") || q.includes("lhr") || q.includes("tbs") || q.includes("gyd")) {
      return "Your flights are all direct:<br/>• **Outbound (Sep 3):** British Airways LHR ➔ TBS (5h 10m).<br/>• **Connection (Sep 12):** Azerbaijan Airlines (AZAL) TBS ➔ GYD (1h 10m).<br/>• **Inbound (Sep 16):** Azerbaijan Airlines (AZAL) GYD ➔ LHR (5h 45m).<br/>You can search/verify dates using the flight cards at the top of the dashboard.";
    }

    if (q.includes("gori") || q.includes("stalin") || q.includes("museum") || q.includes("fortress") || q.includes("war heroes") || q.includes("ateni") || q.includes("sioni")) {
      return "Instead of the controversial Stalin Museum, Day 4 features excellent alternatives in Gori:<br/>• **Gori Fortress:** Climb the medieval citadel for panoramic views.<br/>• **War Heroes Memorial:** Inspect the massive circle of bronze warrior statues.<br/>• **Ateni Sioni:** A 7th-century church south of Gori in a wine valley.<br/>• **Sergi Makalatia Ethnographic Museum:** Explores Shida Kartli archaeological history.";
    }

    if (q.includes("armenia") || q.includes("haghpat") || q.includes("sanahin") || q.includes("debed") || q.includes("monasteries") || q.includes("lavash")) {
      return "On Day 5, you take a private minivan excursion to northern Armenia. You will visit the UNESCO monasteries of **Haghpat** and **Sanahin** in the Debed Canyon. You can also participate in a hands-on **Tonir Lavash baking experience** at a local family estate!";
    }

    if (q.includes("kazbegi") || q.includes("stepantsminda") || q.includes("gergeti") || q.includes("juta") || q.includes("chaukhi") || q.includes("mountain") || q.includes("hike") || q.includes("hiking") || q.includes("paragliding")) {
      return "For your mountain base stay (Days 7–9):<br/>• **Day 7:** Travel the Georgian Military Highway, stopping at Ananuri and Gudauri.<br/>• **Day 8:** Gergeti Trinity Church (option for horseback riding or paragliding!).<br/>• **Day 9:** Hike Juta Valley to Mt. Chaukhi (option for wild herb tea foraging).";
    }

    if (q.includes("baku") || q.includes("azerbaijan") || q.includes("absheron") || q.includes("gobustan") || q.includes("mud") || q.includes("volcano") || q.includes("carpet") || q.includes("tea") || q.includes("fire")) {
      return "For your Baku base stay (Days 10–14):<br/>• **Day 11:** Explore Old Town, try a carpet weaving masterclass, and attend a traditional Armudu tea ceremony.<br/>• **Day 12:** Absheron Fire Temple & Yanar Dag.<br/>• **Day 13:** Gobustan petroglyphs and bubbling mud volcano therapy.";
    }

    if (q.includes("date") || q.includes("dates") || q.includes("september") || q.includes("when")) {
      return "The trip is planned for **September 3, 2026** to **September 16, 2026** (14 days total). This aligns with the earliest availability and offers pleasant autumn weather across the Caucasus.";
    }

    if (q.includes("currency") || q.includes("money") || q.includes("lari") || q.includes("dram") || q.includes("manat") || q.includes("gel") || q.includes("amd") || q.includes("azn")) {
      return "Currencies:<br/>• **Georgia:** Lari (GEL)<br/>• **Armenia:** Dram (AMD)<br/>• **Azerbaijan:** Manat (AZN)<br/>*Tip: Cards are widely accepted in Tbilisi/Baku, but carry cash for Kazbegi and Armenia.*";
    }

    return "I'm not sure about that specific detail, but I can help you with flights, accommodations, visa rules, stay bases, and day-by-day activities. Try asking about 'visas', 'accommodations', 'Gori', or 'Baku'!";
  }
}

// Global function to zoom and focus map on base locations
window.focusMapOnLocation = function(key) {
  const loc = LOCATIONS[key];
  const marker = markers[key];
  if (loc && marker) {
    // Zoom and center map to this location
    map.setView(loc.coords, 14); // zoom level 14 for detail
    // Open the marker's popup
    marker.openPopup();
    // Scroll map container into view if on mobile/small screen
    const mapContainer = document.getElementById("map-container");
    if (mapContainer) {
      mapContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
};
