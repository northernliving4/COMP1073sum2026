/* ---------------------------------------------------------
   1. Configuration
   Sign up for a free key at https://api.nasa.gov/ (instant,
   just an email address) and paste it below. DEMO_KEY also
   works out of the box, but it is rate-limited to ~30
   requests/hour/IP, so a personal key is recommended.
   --------------------------------------------------------- */
const NASA_API_KEY = "DEMO_KEY"; // <-- replace with your own key
const APOD_ENDPOINT = "https://api.nasa.gov/planetary/apod";

/* Student Info */
function renderStudentInfo() {
  const studentId = "N01234567";       // <-- replace with student ID
  const studentName = "Jordan Smith";  // <-- replace with name

  const p = document.createElement("p");
  p.textContent = `${studentName} — Student ID: ${studentId}`;

  document.getElementById("student-info").appendChild(p);
}

/* Background */
function initStarfield() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#e9e9f4";
    stars.forEach((s) => {
      s.twinkle += 0.02;
      const alpha = 0.35 + Math.abs(Math.sin(s.twinkle)) * 0.65;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

/* Date Helper */
function formatDate(d) {
  // Build YYYY-MM-DD from LOCAL date parts (not toISOString, which
  // converts to UTC first and can shift the date by a day depending
  // on the user's timezone).
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function randomDateSince1995() {
  // APOD archive begins 1995-06-16
  const start = new Date("1995-06-16").getTime();
  const end = Date.now();
  const randomTime = start + Math.random() * (end - start);
  return formatDate(new Date(randomTime));
}

/* API Calls */

// Fetch a single day's APOD entry
async function fetchApod(dateStr) {
  const url = `${APOD_ENDPOINT}?api_key=${NASA_API_KEY}&date=${dateStr}&thumbs=true`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NASA APOD API error: ${response.status}`);
  }
  return response.json();
}

// Fetch a range of days in one call (APOD supports start_date/end_date)
async function fetchApodRange(startDateStr, endDateStr) {
  const url = `${APOD_ENDPOINT}?api_key=${NASA_API_KEY}&start_date=${startDateStr}&end_date=${endDateStr}&thumbs=true`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NASA APOD API error: ${response.status}`);
  }
  return response.json();
}

/* Rendering - Featured Card */
function renderFeatured(entry) {
  const featured = document.getElementById("featured");

  // Some entries are videos rather than images; handle both media types
  const mediaHTML =
    entry.media_type === "video"
      ? `<iframe src="${entry.url}" title="${escapeHTML(entry.title)}" allowfullscreen></iframe>`
      : `<img src="${entry.hdurl || entry.url}" alt="${escapeHTML(entry.title)}">`;

  featured.innerHTML = `
    <article class="feature-card">
      <div class="feature-media">
        <span class="media-tag">${entry.media_type}</span>
        ${mediaHTML}
      </div>
      <div class="feature-body">
        <span class="feature-date">${entry.date}</span>
        <h2 class="feature-title">${escapeHTML(entry.title)}</h2>
        <p class="feature-explanation">${escapeHTML(entry.explanation)}</p>
        ${entry.copyright ? `<p class="feature-copyright">© ${escapeHTML(entry.copyright)}</p>` : ""}
      </div>
    </article>
  `;
}

/* Rendering - Gallery Grid */
function renderGallery(entries) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  // Show most recent first
  const sorted = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1));

  sorted.forEach((entry) => {
    const thumb = entry.media_type === "video" ? (entry.thumbnail_url || "") : entry.url;

    const card = document.createElement("div");
    card.className = "gallery-card";
    card.innerHTML = `
      <img src="${thumb}" alt="${escapeHTML(entry.title)}" loading="lazy">
      <div class="gallery-card-body">
        <div class="gallery-card-date">${entry.date}</div>
        <p class="gallery-card-title">${escapeHTML(entry.title)}</p>
      </div>
    `;
    // Clicking a card opens the full entry in the modal
    card.addEventListener("click", () => openModal(entry));
    gallery.appendChild(card);
  });
}

/* Modal */
function openModal(entry) {
  const modal = document.getElementById("modal");
  const body = document.getElementById("modal-body");

  const mediaHTML =
    entry.media_type === "video"
      ? `<iframe src="${entry.url}" title="${escapeHTML(entry.title)}" allowfullscreen></iframe>`
      : `<img src="${entry.hdurl || entry.url}" alt="${escapeHTML(entry.title)}">`;

  body.innerHTML = `
    ${mediaHTML}
    <span class="feature-date">${entry.date}</span>
    <h2 class="feature-title">${escapeHTML(entry.title)}</h2>
    <p class="feature-explanation" style="max-height:none;">${escapeHTML(entry.explanation)}</p>
    ${entry.copyright ? `<p class="feature-copyright">© ${escapeHTML(entry.copyright)}</p>` : ""}
  `;

  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("modal-body").innerHTML = "";
}

/* Utilities */
function escapeHTML(str = "") {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function showError(message) {
  document.getElementById("featured").innerHTML = `<p class="placeholder">⚠ ${escapeHTML(message)}</p>`;
}

/* Event Wiring */
async function loadFeaturedForDate(dateStr) {
  try {
    document.getElementById("featured").innerHTML = `<p class="placeholder">Contacting NASA...</p>`;
    const entry = await fetchApod(dateStr);
    renderFeatured(entry);
  } catch (err) {
    showError("Could not load that date's picture. Try another date.");
    console.error(err);
  }
}

async function loadGallery(days) {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - Number(days));

    const entries = await fetchApodRange(formatDate(start), formatDate(end));
    renderGallery(entries);
  } catch (err) {
    console.error(err);
    document.getElementById("gallery").innerHTML = `<p class="placeholder">⚠ Could not load the gallery right now.</p>`;
  }
}

function initEventListeners() {
  const dateInput = document.getElementById("apod-date");
  const today = formatDate(new Date());
  dateInput.max = today;
  dateInput.value = today;

  document.getElementById("fetch-today").addEventListener("click", () => {
    dateInput.value = today;
    loadFeaturedForDate(today);
  });

  document.getElementById("fetch-random").addEventListener("click", () => {
    const randomDate = randomDateSince1995();
    dateInput.value = randomDate;
    loadFeaturedForDate(randomDate);
  });

  dateInput.addEventListener("change", () => loadFeaturedForDate(dateInput.value));

  document.getElementById("fetch-gallery").addEventListener("click", () => {
    const days = document.getElementById("range-days").value;
    loadGallery(days);
  });

  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") closeModal(); // click outside content closes modal
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* Init */
document.addEventListener("DOMContentLoaded", () => {
  renderStudentInfo();
  initStarfield();
  initEventListeners();

  // Initial load: today's picture + an 8-day gallery
  loadFeaturedForDate(formatDate(new Date()));
  loadGallery(8);
});