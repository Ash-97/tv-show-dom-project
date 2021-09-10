//You can edit ALL of the code here

const allEpisodes = getAllEpisodes();

function setup() {
  makePageForEpisodes(allEpisodes);
  episodeSelectorMenu(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootEl = document.getElementById("root");
  const totalNumber = document.getElementById("totalNumberOfEpisodes");
  totalNumber.innerText = `Displaying ${episodeList.length}/${allEpisodes.length} episode(s)`;
  rootEl.textContent = "";
  episodeList.forEach((element) => {
    /*--------------------- Episode Cards ---------------------*/

    let episodeCardEl = document.createElement("div");
    episodeCardEl.setAttribute("class", "episodeCard");
    rootEl.appendChild(episodeCardEl);

    /*--------------------- Episode Title and Episode Code ---------------------*/

    let episodeTitleEl = document.createElement("h3");
    episodeCardEl.appendChild(episodeTitleEl);
    episodeTitleEl.setAttribute("class", "episodeTitle");
    episodeTitleEl.innerHTML = `<a href=${
      element.url
    } target="blank" class="episode-link" <strong>${
      element.name
    } - S${episodeCode(element.season)}E${episodeCode(
      element.number
    )}</strong></a>`;

    /*--------------------- Episode Image ---------------------*/

    let episodeImgEl = document.createElement("img");
    episodeCardEl.appendChild(episodeImgEl);
    episodeImgEl.src = `${element.image.medium}`;

    /*--------------------- Episode Summary ---------------------*/

    let summaryEl = document.createElement("p");
    episodeCardEl.appendChild(summaryEl);
    summaryEl.setAttribute("class", "summary");
    summaryEl.innerHTML = `${element.summary}`;

    /*--------------------- Link to Episode Page on Tvmaze ---------------------*/

    // let linkToEpisodePage = document.createElement("a");
    // episodeCardEl.appendChild(linkToEpisodePage);
    // linkToEpisodePage.innerHTML = `<a href=${element.url} target="blank" <strong>Read More</strong></a>`;
  });
}

function episodeCode(num) {
  if (num < 10) {
    return "0" + num;
  } else return num;
}

/*--------------------- Function For SearchBar ---------------------*/

const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("input", searchFilter);

function searchFilter(event) {
  event.preventDefault();
  let searchInput = event.target.value.toLowerCase();
  let filteredSearchResults = allEpisodes.filter((episode) => {
    return (
      episode.name.toLowerCase().includes(searchInput) ||
      episode.summary.toLowerCase().includes(searchInput)
    );
  });
  makePageForEpisodes(filteredSearchResults);
}

/*--------------------- Function For Episode Selector ---------------------*/

const searchBoxDiv = document.getElementById("searchBox");
const selectEl = document.createElement("select");
searchBoxDiv.appendChild(selectEl);

selectEl.addEventListener("change", selectFilter);

function episodeSelectorMenu(episodeList) {
  episodeList.forEach((episode) => {
    const episodeOptions = document.createElement("option");
    selectEl.appendChild(episodeOptions);
    selectEl.setAttribute("id", "episodeSelectorDropdown");
    // selectEl.setAttribute("onchange", "selectFilter();");
    episodeOptions.setAttribute("value", `${episode.name}`);
    episodeOptions.innerText = `S${episodeCode(episode.season)}E${episodeCode(
      episode.number
    )} - ${episode.name}`;
  });
}

function selectFilter() {
  const usersOptionValue = document.querySelector("select");
  var selectedValue = usersOptionValue.value;
  const filterUserSelectedEpisode = allEpisodes.filter((episode) => {
    return episode.name.includes(selectedValue);
  });
  makePageForEpisodes(filterUserSelectedEpisode);
}

window.onload = setup;
