//You can edit ALL of the code here
/*--------------------- Fetch Function To Get The Data For All The Episodes ---------------------*/
function fetchAllEpisodes() {
  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      }
    })
    .then((data) => {
      if (!localStorage.getItem("episodes")) {
        localStorage.setItem("episodes", JSON.stringify(data));
      }
    })
    .catch((error) => console.error("Error Occurred:", error));
}
fetchAllEpisodes();

// async function fetchAllEpisodesData() {
//   const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
//   const data = await response.json();
//   return data;
// }

// if (!localStorage.getItem("episodes")) {
//   fetchAllEpisodesData().then((data) =>
//     localStorage.setItem("episodes", JSON.stringify(data))
//   );
// }

const allEpisodesString = localStorage.getItem("episodes");
const allEpisodesArray = JSON.parse(allEpisodesString);

/*--------------------- Function For Setup On Load ---------------------*/
function setup() {
  makePageForEpisodes(allEpisodesArray);
  episodeSelectorMenu(allEpisodesArray);
}

/*--------------------- Function To Create Episode Cards ---------------------*/
function makePageForEpisodes(episodeList) {
  const rootEl = document.getElementById("root");
  const totalNumber = document.getElementById("totalNumberOfEpisodes");
  totalNumber.innerText = `Displaying ${episodeList.length}/${allEpisodesArray.length} episode(s)`;
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

    let summaryEl = document.createElement("section");
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
  let filteredSearchResults = allEpisodesArray.filter((episode) => {
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
  const filterUserSelectedEpisode = allEpisodesArray.filter((episode) => {
    return episode.name.includes(selectedValue);
  });
  makePageForEpisodes(filterUserSelectedEpisode);
}

/*--------------------- Function For Show All Episodes Button ---------------------*/
const showAllButtonEl = document.createElement("button");
searchBoxDiv.appendChild(showAllButtonEl);
showAllButtonEl.setAttribute("id", "showAllBtn");
showAllButtonEl.innerText = "Show All Episodes";
showAllButtonEl.addEventListener("click", () => {
  makePageForEpisodes(allEpisodesArray);
});

window.onload = setup;
