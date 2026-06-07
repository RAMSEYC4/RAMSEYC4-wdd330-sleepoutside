// Base URL — swap this for your backend once it's running
const API_BASE = "http://localhost:3000/api";

const form = document.getElementById("searchForm");
const searchBtn = document.getElementById("searchBtn");
const btnText = searchBtn.querySelector(".btn-text");
const btnLoader = searchBtn.querySelector(".btn-loader");
const errorBanner = document.getElementById("errorBanner");
const errorMessage = document.getElementById("errorMessage");
const results = document.getElementById("results");
const historySection = document.getElementById("historySection");
const historyList = document.getElementById("historyList");

// ── History (localStorage) ──────────────────────────────────────────────────

function getHistory() {
  return JSON.parse(localStorage.getItem("mnvp_history") || "[]");
}

function saveHistory(movie, zip) {
  const history = getHistory().filter(
    (h) => !(h.movie === movie && h.zip === zip)
  );
  history.unshift({ movie, zip, ts: Date.now() });
  localStorage.setItem("mnvp_history", JSON.stringify(history.slice(0, 8)));
  renderHistory();
}

function renderHistory() {
  const history = getHistory();
  if (!history.length) {
    historySection.classList.add("hidden");
    return;
  }
  historySection.classList.remove("hidden");
  historyList.innerHTML = history
    .map(
      (h) =>
        `<li class="history-item" data-movie="${h.movie}" data-zip="${h.zip}">
          ${h.movie} <span>${h.zip}</span>
        </li>`
    )
    .join("");
}

historyList.addEventListener("click", (e) => {
  const item = e.target.closest(".history-item");
  if (!item) return;
  document.getElementById("movieInput").value = item.dataset.movie;
  document.getElementById("zipInput").value = item.dataset.zip;
  form.dispatchEvent(new Event("submit"));
});

// ── UI Helpers ───────────────────────────────────────────────────────────────

function setLoading(loading) {
  searchBtn.disabled = loading;
  btnText.classList.toggle("hidden", loading);
  btnLoader.classList.toggle("hidden", !loading);
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorBanner.classList.remove("hidden");
}

function hideError() {
  errorBanner.classList.add("hidden");
}

// ── Render ───────────────────────────────────────────────────────────────────

function renderMovie(movie) {
  const poster = document.getElementById("moviePoster");
  const placeholder = document.getElementById("posterPlaceholder");

  if (movie.poster && movie.poster !== "N/A") {
    poster.src = movie.poster;
    poster.alt = movie.title;
    poster.classList.remove("hidden");
    placeholder.classList.add("hidden");
  } else {
    poster.classList.add("hidden");
    placeholder.classList.remove("hidden");
  }

  document.getElementById("movieTitle").textContent = movie.title;
  document.getElementById("movieYear").textContent = movie.year;
  document.getElementById("movieGenre").textContent = movie.genre;
  document.getElementById("movieRatingVal").textContent = movie.imdbRating;
  document.getElementById("movieDirector").textContent = movie.director;
  document.getElementById("moviePlot").textContent = movie.plot;
}

function renderRestaurants(restaurants) {
  const grid = document.getElementById("restaurantGrid");

  if (!restaurants || !restaurants.length) {
    grid.innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem;">No restaurants found for this zip code.</p>`;
    return;
  }

  grid.innerHTML = restaurants
    .map((r) => {
      const stars = "★".repeat(Math.round(r.rating)) + "☆".repeat(5 - Math.round(r.rating));
      const deliveryTag = r.delivery
        ? `<span class="tag tag--delivery">🛵 Delivery</span>`
        : "";
      const pickupTag = r.pickup
        ? `<span class="tag tag--pickup">🥡 Pickup</span>`
        : "";

      return `
        <div class="restaurant-card">
          <div class="restaurant-card__name">${r.name}</div>
          <div class="restaurant-card__cuisine">${r.cuisine}</div>
          <div class="restaurant-card__rating">${stars} <span style="color:var(--text-muted)">(${r.reviewCount} reviews)</span></div>
          <div class="restaurant-card__meta">
            ${deliveryTag}
            ${pickupTag}
            ${r.price ? `<span class="tag">${r.price}</span>` : ""}
          </div>
        </div>`;
    })
    .join("");
}

// ── Form Submit ───────────────────────────────────────────────────────────────

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();
  results.classList.add("hidden");

  const movie = document.getElementById("movieInput").value.trim();
  const zip = document.getElementById("zipInput").value.trim();

  if (!movie || !zip) return;

  setLoading(true);

  try {
    const res = await fetch(`${API_BASE}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movie, zip }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Server error: ${res.status}`);
    }

    const data = await res.json();

    renderMovie(data.movie);
    renderRestaurants(data.restaurants);
    results.classList.remove("hidden");
    saveHistory(movie, zip);
  } catch (err) {
    showError(err.message || "Could not reach the server. Is the backend running?");
  } finally {
    setLoading(false);
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
renderHistory();
