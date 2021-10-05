//You can edit ALL of the code here
const allShows = getAllShows();
const rootEl = document.getElementById("root");
const totalNumberDisplayed = document.getElementById(
  "totalNumberOfShowsAndEpisodes"
);
/*--------------------- Function For Setup On Load ---------------------*/
function setup() {
  makePageForShows(showsArraySorted);
  showSelectorMenu(showsArraySorted);
}

/*--------------------- Function To Sort Shows Array Alphabetically---------------------*/
function sortShowsArray(showList) {
  return showList.sort((a, b) => a.name.localeCompare(b.name));
  // showList.sort((a, b) => {
  //   if (a.name < b.name) {
  //     return -1;
  //   }
  //   if (a.name > b.name) {
  //     return 1;
  //   }
  //   return 0;
  // });
}
const showsArraySorted = sortShowsArray(allShows);

/*--------------------- Function To Create Show Cards ---------------------*/
function makePageForShows(showList) {
  totalNumberDisplayed.innerText = `Displaying ${showList.length}/${allShows.length} Show(s)`;
  rootEl.textContent = " ";
  showList.forEach((element) => {
    /*--------------------- Show Cards ---------------------*/

    const showCardEl = document.createElement("div");
    showCardEl.setAttribute("class", "showCard");
    rootEl.appendChild(showCardEl);

    /*--------------------- Show Title and Link To Create Episode Cards ---------------------*/

    const showTitleEl = document.createElement("h3");
    showCardEl.appendChild(showTitleEl);
    showTitleEl.setAttribute("class", "showTitle");
    showTitleEl.innerText = `${element.name}`;

    /*--------------------- Show Image ---------------------*/
    const showCardMainTags = document.createElement("div");
    showCardEl.appendChild(showCardMainTags);
    showCardMainTags.setAttribute("class", "showCardMainTags");
    const showImgEl = document.createElement("img");
    showCardMainTags.appendChild(showImgEl);
    showImgEl.setAttribute("class", "showImg");
    // showImgEl.src = `${element.image.medium}`;
    if (element.image != null) {
      showImgEl.src = element.image.medium;
    } else {
      showImgEl.src = "";
    }

    /*--------------------- Show Summary ---------------------*/

    const showSummaryEl = document.createElement("section");
    showCardMainTags.appendChild(showSummaryEl);
    showSummaryEl.setAttribute("class", "showSummary");
    showSummaryEl.innerHTML = `${element.summary}`;

    /*--------------------- Show Details ---------------------*/
    const showDetailsDiv = document.createElement("div");
    showCardMainTags.appendChild(showDetailsDiv);
    showDetailsDiv.setAttribute("class", "showDetails");
    const showRatingEl = document.createElement("p");
    showDetailsDiv.appendChild(showRatingEl);
    showRatingEl.innerHTML = `<strong>Rating:</strong> ${element.rating.average}`;
    const showGenresEl = document.createElement("p");
    showDetailsDiv.appendChild(showGenresEl);
    showGenresEl.innerHTML = `<strong>Genres:</strong> ${element.genres.join(
      " | "
    )}`;
    const showStatusEl = document.createElement("p");
    showDetailsDiv.appendChild(showStatusEl);
    showStatusEl.innerHTML = `<strong>Status:</strong> ${element.status}`;
  });
}

/*--------------------- Fetch Function To Get The Data For All The Episodes ---------------------*/
function fetchAllEpisodesForShow(showID) {
  fetch(`https://api.tvmaze.com/shows/${showID}/episodes`)
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      }
    })
    .then((data) => {
      makePageForEpisodes(data);

      /*--------------------- Search Function For Episodes ---------------------*/
      searchBar.addEventListener("keyup", episodeSearchFilter);
      function episodeSearchFilter(event) {
        event.preventDefault();
        let searchInput = event.target.value.toLowerCase();
        let filteredSearchEpisodes = data.filter((episode) => {
          return (
            episode.name.toLowerCase().includes(searchInput) ||
            episode.summary.toLowerCase().includes(searchInput)
          );
        });
        makePageForEpisodes(filteredSearchEpisodes);
      }

      /*--------------------- Event Listener For Episode Selector ---------------------*/
      episodeSelectorEl.innerHTML = "";
      episodeSelectorMenu(data);
      const usersEpisodeOption = document.getElementById(
        "episodeSelectorDropdown"
      );

      usersEpisodeOption.style.display = "inline";
      episodeSelectorEl.addEventListener("change", episodeSelectFilter);
      function episodeSelectFilter() {
        const selectedEpisodeValue = usersEpisodeOption.value;
        const filterUserSelectedEpisode = data.filter((episode) => {
          return episode.name.includes(selectedEpisodeValue);
        });
        makePageForEpisodes(filterUserSelectedEpisode);
      }
    })
    .catch((error) => console.error("Error Occurred:", error));
}

/*--------------------- Function To Create Episode Cards ---------------------*/
function makePageForEpisodes(episodeList) {
  totalNumberDisplayed.innerText = `Displaying ${episodeList.length} Episode(s)`;
  rootEl.textContent = "";
  episodeList.forEach((element) => {
    /*--------------------- Episode Cards ---------------------*/

    const episodeCardEl = document.createElement("div");
    episodeCardEl.setAttribute("class", "episodeCard");
    rootEl.appendChild(episodeCardEl);

    /*--------------------- Episode Title and Episode Code ---------------------*/

    const episodeTitleEl = document.createElement("h3");
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

    const episodeImgEl = document.createElement("img");
    episodeCardEl.appendChild(episodeImgEl);
    episodeImgEl.setAttribute("class", "episodeImg");
    if (element.image != null) {
      episodeImgEl.src = element.image.medium;
    } else {
      episodeImgEl.src = "";
    }

    /*--------------------- Episode Summary ---------------------*/

    const episodeSummaryEl = document.createElement("section");
    episodeCardEl.appendChild(episodeSummaryEl);
    episodeSummaryEl.setAttribute("class", "episodeSummary");
    episodeSummaryEl.innerHTML = `${element.summary}`;

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
searchBar.addEventListener("keyup", showSearchFilter);

function showSearchFilter(event) {
  event.preventDefault();
  let searchInput = event.target.value.toLowerCase();
  let filteredSearchResults = allShows.filter((show) => {
    return (
      show.name.toLowerCase().includes(searchInput) ||
      show.summary.toLowerCase().includes(searchInput) ||
      show.genres.includes(searchInput)
    );
  });
  makePageForShows(filteredSearchResults);
}

/*--------------------- Function For Show Selector ---------------------*/
const searchBoxDiv = document.getElementById("searchBox");
const showsDiv = document.createElement("div");
searchBoxDiv.appendChild(showsDiv);
const showSelectorEl = document.createElement("select");
showsDiv.appendChild(showSelectorEl);
showSelectorEl.setAttribute("id", "showSelectorDropdown");

function showSelectorMenu(showList) {
  const defaultShowOption = document.createElement("option");
  defaultShowOption.setAttribute("value", "null");
  defaultShowOption.innerText = "Select A TV-Show";
  showSelectorEl.appendChild(defaultShowOption);
  showList.forEach((show) => {
    const showOptions = document.createElement("option");
    showSelectorEl.appendChild(showOptions);
    showOptions.setAttribute("value", `${show.name}`);
    showOptions.innerText = `${show.name}`;
  });
}

showSelectorEl.addEventListener("change", showSelectFilter);
function showSelectFilter() {
  const usersShowOption = document.getElementById("showSelectorDropdown");
  const selectedShowValue = usersShowOption.value;
  let usersClickedShow;
  allShows.filter((show) => {
    if (show.name === selectedShowValue) {
      usersClickedShow = show.id;
    }
  });
  fetchAllEpisodesForShow(usersClickedShow);
}

/*--------------------- Function To Create Episode Selector ---------------------*/
const episodesDiv = document.createElement("div");
searchBoxDiv.appendChild(episodesDiv);
const episodeSelectorEl = document.createElement("select");
episodesDiv.appendChild(episodeSelectorEl);
episodeSelectorEl.setAttribute("id", "episodeSelectorDropdown");

function episodeSelectorMenu(episodeList) {
  const defaultEpisodeOption = document.createElement("option");
  defaultEpisodeOption.setAttribute("value", "null");
  defaultEpisodeOption.innerText = "Select An Episode";
  episodeSelectorEl.appendChild(defaultEpisodeOption);
  episodeList.forEach((episode) => {
    const episodeOptions = document.createElement("option");
    episodeSelectorEl.appendChild(episodeOptions);
    episodeOptions.setAttribute("value", `${episode.name}`);
    episodeOptions.innerText = `S${episodeCode(episode.season)}E${episodeCode(
      episode.number
    )} - ${episode.name}`;
  });
}

/*--------------------- Function For Show All Button ---------------------*/
const viewAllShowsButtonEl = document.createElement("button");
searchBoxDiv.appendChild(viewAllShowsButtonEl);
viewAllShowsButtonEl.setAttribute("id", "viewAllShowsBtn");
viewAllShowsButtonEl.innerText = "View All Shows";
viewAllShowsButtonEl.addEventListener("click", () => {
  const usersEpisodeOption = document.getElementById("episodeSelectorDropdown");
  usersEpisodeOption.style.display = "none";
  makePageForShows(showsArraySorted);
});

window.onload = setup;
