//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear previous content

  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    // Format episode code as SxxExx
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;

    episodeCard.innerHTML = `
      <img src="${episode.image ? episode.image.medium : ""}" alt="${episode.name}">
      <h3>${episode.name} <span class="episode-code">(${episodeCode})</span></h3>
      <p>${episode.summary}</p>
      <a href="${episode.url}" target="_blank">More Info</a>
    `;

    rootElem.appendChild(episodeCard);
  });
}

window.onload = setup;

git
