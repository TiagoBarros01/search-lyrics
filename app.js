const form = document.querySelector("#form");
const searchInput = document.querySelector("#search");
const songsElement = document.querySelector("#songs-container");
const prevAndNextElement = document.querySelector("#prev-and-next-container");

const apiURL = `https://api.lyrics.ovh`;

const fetchData = async (url) => {
  const res = await fetch(url);
  return await res.json();
};

const getMoreSongs = async (url) => {
  const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`);

  insertSongsIntoPage(data);
};

insertNextAndPrevButons = ({ prev, next }) => {
  prevAndNextElement.innerHTML = `
  ${
    prev
      ? `<button class="btn" onClick="getMoreSongs('${prev}')">Previous page</button>`
      : ""
  }
  ${
    next
      ? `<button class="btn" onClick="getMoreSongs('${next}')">Next page</button>`
      : ""
  }
`;
};

const insertSongsIntoPage = ({ data, prev, next }) => {
  songsElement.innerHTML = data
    .map(
      ({ artist: { name }, title }) => `
  <li class="song">
    <span class="song-artist"><strong>${name}</strong> - ${title}</span>
    <button class="btn" data-artist="${name}" data-song-title="${title}">Show lyric</button>
  </li>
  `
    )
    .join("");

  if (prev || next) {
    insertNextAndPrevButons({ prev, next });
    return;
  }

  prevAndNextElement.innerHTML = "";
};

const fetchSongs = async (term) => {
  const data = await fetchData(`${apiURL}/suggest/${term}`);
  insertSongsIntoPage(data);
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();
  searchInput.value = ""
  searchInput.focus();

  if (!searchTerm) {
    songsElement.innerHTML = `<li class="warning-message">Please, insert a valid term</li>`;
    return;
  }

  fetchSongs(searchTerm);
}

form.addEventListener("submit", handleFormSubmit);

const insertLyricsIntoPage = ({ lyrics, artist, songTitle }) => {
  songsElement.innerHTML = `
    <li class="lyrics-container">
      <h2><strong>${songTitle}</strong> - ${artist}</h2>
      <p class="lyrics">${lyrics}</p>
    </li>
  `;
};

const fetchLyrics = async (artist, songTitle) => {
  const data = await fetchData(`${apiURL}/v1/${artist}/${songTitle}`);
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
  insertLyricsIntoPage({ lyrics, artist, songTitle });
};

const handleSongsElementClick = event => {
    const clickedElement = event.target;
  
    if (clickedElement.tagName === "BUTTON") {
      const artist = clickedElement.getAttribute("data-artist");
      const songTitle = clickedElement.getAttribute("data-song-title");
  
      prevAndNextElement.innerHTML = "";
  
      fetchLyrics(artist, songTitle);
    }
}

songsElement.addEventListener("click", handleSongsElementClick);
