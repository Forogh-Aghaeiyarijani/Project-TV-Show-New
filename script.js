const API_BASE = "https://api.tvmaze.com";
let allEpisodes = [];
let allShows = [];
let cachedEpisodes = {};

async function loadShows() {
  try {
    const response = await fetch(`${API_BASE}/shows`);
    if (!response.ok) throw new Error("Failed to fetch shows");
    allShows = await response.json();
    allShows.sort((a, b) => a.name.localeCompare(b.name));
    displayShows(allShows);
    populateDropdown(allShows);
  } catch (error) {
    console.error(error);
  }
}

function displayShows(showList) {
  const showListElem = document.getElementById("show-list");
  showListElem.innerHTML = "";

  showList.forEach((show) => {
    const card = document.createElement("div");
    card.classList.add("show-card");
    card.innerHTML = `
      <h2>${show.name}</h2>
      <img src="${show.image ? show.image.medium : "placeholder.jpg"}" alt="${
      show.name
    }">
      <p><strong>Genres:</strong> ${show.genres.join(", ")}</p>
      <p><strong>Status:</strong> ${show.status}</p>
      <p><strong>Rating:</strong> ${show.rating.average || "N/A"}</p>
      <p><strong>Runtime:</strong> ${show.runtime || "N/A"} minutes</p>
      <p>${show.summary || "No summary available."}</p>
    `;
    card.addEventListener("click", () => loadEpisodes(show.id));
    showListElem.appendChild(card);
  });
}

function populateDropdown(shows) {
  const selectElem = document.getElementById("show-select");
  selectElem.innerHTML = shows
    .map((show) => `<option value="${show.id}">${show.name}</option>`)
    .join("");

  selectElem.addEventListener("change", (event) => {
    if (event.target.value) {
      loadEpisodes(event.target.value);
    }
  });
}

async function loadEpisodes(showId) {
  if (!cachedEpisodes[showId]) {
    const response = await fetch(`${API_BASE}/shows/${showId}/episodes`);
    if (!response.ok) throw new Error("Failed to fetch episodes");
    cachedEpisodes[showId] = await response.json();
  }

  allEpisodes = cachedEpisodes[showId];
  document.getElementById("show-list").style.display = "none";
  document.getElementById("back-to-shows").style.display = "block";
  displayEpisodes(allEpisodes);
}

function displayEpisodes(episodes) {
  const rootElem = document.getElementById("root");
  const countElem = document.getElementById("episode-count");
  rootElem.innerHTML = "";
  countElem.textContent = `Showing ${episodes.length} episode(s)`;

  episodes.forEach((episode) => {
    const card = document.createElement("div");
    card.classList.add("episode-card");
    card.innerHTML = `
      <h2>${episode.name} - S${String(episode.season).padStart(
      2,
      "0"
    )}E${String(episode.number).padStart(2, "0")}</h2>
      <img src="${
        episode.image ? episode.image.medium : "placeholder.jpg"
      }" alt="${episode.name}">
      <p>${episode.summary || "No summary available."}</p>
    `;
    rootElem.appendChild(card);
  });
}

function setupShowSearch() {
  const searchInput = document.getElementById("show-search");
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredShows = allShows.filter(
      (show) =>
        show.name.toLowerCase().includes(searchTerm) ||
        show.genres.some((genre) => genre.toLowerCase().includes(searchTerm)) ||
        (show.summary && show.summary.toLowerCase().includes(searchTerm))
    );
    displayShows(filteredShows);
  });
}

function setupNavigation() {
  const backButton = document.getElementById("back-to-shows");
  backButton.addEventListener("click", () => {
    document.getElementById("show-list").style.display = "flex";
    document.getElementById("root").innerHTML = "";
    backButton.style.display = "none";
  });
}

function setup() {
  loadShows();
  setupShowSearch();
  setupNavigation();
}

window.onload = setup;
