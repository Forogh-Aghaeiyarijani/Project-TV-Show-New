let allEpisodes = [];

async function fetchEpisodes() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "<p>Loading episodes...</p>";

  try {
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    if (!response.ok) {
      throw new Error(`Failed to load episodes: ${response.statusText}`);
    }

    allEpisodes = await response.json();
    makePageForEpisodes(allEpisodes);
  } catch (error) {
    rootElem.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
}

function setup() {
  fetchEpisodes();

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = episode.summary
        ? episode.summary.toLowerCase().includes(searchTerm)
        : false;
      return nameMatch || summaryMatch;
    });
    makePageForEpisodes(filteredEpisodes);
  });
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const countElem = document.getElementById("episode-count");

  rootElem.innerHTML = ""; // Clear previous content
  countElem.textContent = `Showing ${episodeList.length} episode(s)`;

  episodeList.forEach((episode) => {
    const card = document.createElement("div");
    card.classList.add("episode-card");

    const title = document.createElement("h2");
    title.textContent = `${episode.name} - S${String(episode.season).padStart(
      2,
      "0"
    )}E${String(episode.number).padStart(2, "0")}`;

    const image = document.createElement("img");
    image.src = episode.image ? episode.image.medium : "placeholder.jpg";
    image.alt = `Image for ${episode.name}`;

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary || "No summary available.";

    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(summary);
    rootElem.appendChild(card);
  });
}

window.onload = setup;


   