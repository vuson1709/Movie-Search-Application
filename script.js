const containerRecently = document.querySelector(".recently-release");
const containerSearchResult = document.querySelector(
  ".search-result-container"
);
const elMovieList = document.querySelector(".movie-list");
const elMovieImg = document.querySelector(".movie-image");
const elMovieTitle = document.querySelector(".movie-title");
const elMovieGenre = document.querySelector(".movie-genre");
const btnDetails = document.querySelector(".movie-details");
const btnSearch = document.querySelector(".btn-search");
const btnSort = document.querySelector(".btn-sort");
const btnFilter = document.querySelector(".btn-filter");
const elSearchBar = document.querySelector("#search-bar");
const modal = document.querySelector(".modal");

let current_page = 1;
const records_per_page = 4;
const btnPrev = document.querySelector(".prev");
const btnNext = document.querySelector(".next");
let elPage = document.querySelector(".page");

const genres = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

// API key
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NzEyNmM0M2FjZDM1NjY4YWJkMjllMDdlYjVjNjkxMSIsInN1YiI6IjY1MWZmNTI1NzQ1MDdkMDBmZjk5MWI0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ktiM7-X8d1rWfhJsX3oEXntFS7ZaM1Zx8VSmDnZKiQw",
  },
};

// ===================== FUNTIONALITY ==================
function reduceText(text, numWord) {
  return `${text.split(" ").slice(0, numWord).join(" ")}...See more`;
}

// Approach 2: Generate 10 unique number in array
const uniqueRandomMovies = () => {
  const movies = new Set();
  while (movies.size < 10) {
    movies.add(Math.floor(Math.random() * 19 + 1));
  }
  return [...movies];
};
let recentlyMoviesResults = [];

// FETCH MOVIE
async function fetchUrl(url) {
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

const displayRecentlyMovies = async function () {
  try {
    const data = await fetchUrl(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"
    );

    // RECENTLY RELEASE
    const displayReMovie = function (n) {
      const imgSrc = `https://image.tmdb.org/t/p/w500${data.results[n].poster_path}`;
      const movieTitle = data.results[n].title;
      const genre = data.results[n].genre_ids.map((genre) => genres[genre]);
      const overview = reduceText(data.results[n].overview, 14);

      const html = `
      <article class="movie-info">
      <img
      src=${imgSrc}
      alt=${movieTitle}
      class="movie-image"
    />
    <div class="movie-data">
      <h3 class="movie-title">${movieTitle}</h3>
      <p class="movie-genre">${genre.slice(0, 3).join(", ")},...</p>
      <p class="movie-overview">${overview}</p>
    </div>
</article>`;
      elMovieList.insertAdjacentHTML("beforeend", html);
    };

    // LOOP AND DISPLAY 10 MOVIE, also store movie ID for later to display trailer on modal
    uniqueRandomMovies().forEach((i) => {
      displayReMovie(i);
      recentlyMoviesResults.push(data.results[i]);
    });

    // Wait for class to insert in HTML, then call modal
    handleModal(
      document.querySelectorAll(".movie-info"),
      recentlyMoviesResults
    );
  } catch (err) {
    console.log(err);
  }
};
displayRecentlyMovies();

let searchResults = [];
let searchValue;

// SEARCH EVENT
btnSearch.addEventListener("click", (e) => {
  e.preventDefault();

  // Get search result
  searchValue = elSearchBar.value;
  if (!searchValue) return null;

  getSearchResults(searchValue);

  // Clear input field
  elSearchBar.value = "";
  elSearchBar.blur();
  elSearchBar.placeholder = `Searching for "${searchValue}"`;

  // Hide Recently Release part and remove from browser so that the search result can be lifted top
  containerRecently.style.opacity = 0;
  setTimeout(() => (containerRecently.className = "hidden"), 1000);

  // Reset initial sort and filter
  btnSort.value = "default";
});

// GET SEARCH RESULTS
async function getSearchResults(searchValue) {
  try {
    const data = await fetchUrl(
      `https://api.themoviedb.org/3/search/movie?query=${searchValue}&include_adult=false&language=en-US&page=1`
    );
    // store search result to global variable
    searchResults = data.results;
    console.log(searchResults);

    // Display after search
    displaySearchResult();
  } catch (err) {
    console.error(err);
  }
}

// DISPLAY SEARCH RESULTS
function displaySearchResult(filter = 0, sort = "default") {
  // Clear old result
  containerSearchResult.innerHTML = "";

  if (searchResults.length === 0) {
    containerSearchResult.insertAdjacentHTML(
      "beforeend",
      `<p style="text-align: center">No result found</p>`
    );
    document.querySelector(".search-result").style.opacity = 100;
    return;
  }

  // Show current page
  elPage.innerHTML = `page ${current_page}/${numPage()}`;

  // if (sort === "default") {
  //   if (filter === 0) {
  //     sortedMovies = searchResults;
  //   } else {
  //     sortedMovies = searchResults
  //       .slice()
  //       .filter((movie) => movie.genre_ids.includes(filter));
  //   }
  // }

  // if (sort === "newest") {
  //   if (filter === 0) {
  //     sortedMovies = searchResults
  //       .slice()
  //       .sort((a, b) => b.release_date.localeCompare(a.release_date));
  //   } else {
  //     sortedMovies = searchResults
  //       .slice()
  //       .sort((a, b) => b.release_date.localeCompare(a.release_date))
  //       .filter((movie) => movie.genre_ids.includes(filter));
  //   }
  // }

  // if (sort === "oldest") {
  //   if (filter === 0) {
  //     sortedMovies = searchResults
  //       .slice()
  //       .sort((a, b) => a.release_date.localeCompare(b.release_date));
  //   } else {
  //     sortedMovies = searchResults
  //       .slice()
  //       .sort((a, b) => a.release_date.localeCompare(b.release_date))
  //       .filter((movie) => movie.genre_ids.includes(filter));
  //   }
  // }

  function sortByReleaseDate(a, b) {
    return b.release_date.localeCompare(a.release_date);
  }

  function sortByOldestFirst(a, b) {
    return a.release_date.localeCompare(b.release_date);
  }

  function filterByGenre(movies, genreId) {
    return movies.filter((movie) => movie.genre_ids.includes(genreId));
  }

  let sortedMovies = [...searchResults];

  if (sort === "newest") {
    sortedMovies.sort(sortByReleaseDate);
  } else if (sort === "oldest") {
    sortedMovies.sort(sortByOldestFirst);
  }

  if (filter !== 0) {
    sortedMovies = filterByGenre(sortedMovies, filter);
  }

  sortedMovies
    .slice(
      (current_page - 1) * records_per_page,
      (current_page - 1) * records_per_page + records_per_page
    )
    .forEach((movie) => {
      const imgSrc = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : `./Image_not_available2.jpeg`;

      const movieTitle = movie.title;
      const releaseYear = movie.release_date
        ? `(${movie.release_date.split("-")[0]})`
        : "";
      const genre = movie.genre_ids.map((genre) => genres[genre]);
      const overview =
        movie.overview === "No description found" || movie.overview === ""
          ? "No description found"
          : reduceText(movie.overview, 24);

      const html = `
        <div class="search-info">
          <img src=${imgSrc} alt="${movieTitle}" />
          <div class="search movie-data">
            <h3 class="search-title">${movieTitle}</h3>
            <span class="release-year">${releaseYear}</span>
            <p class="movie-genre">${
              genre.length === 0
                ? ""
                : genre.length === 1
                ? genre
                : genre.slice(0, 3).join(", ") + ",..."
            }</p>
            <p>${overview}</p>
          </div> 
        </div>`;

      containerSearchResult.insertAdjacentHTML("beforeend", html);
    });

  document.querySelector(".search-result").style.opacity = 100;
  // Wait for class to insert in HTML, then call modal
  handleModal(document.querySelectorAll(".search-info"), searchResults);
}

// SORT SEARCH
btnSort.addEventListener("change", () => {
  displaySearchResult(Number(btnFilter.value), btnSort.value);
});

// MODAL
async function handleModal(container, dataResults) {
  try {
    container.forEach((el, i) => {
      el.addEventListener("click", async function () {
        const movieTitle = dataResults[i].title;
        const releaseYear = dataResults[i].release_date
          ? `(${dataResults[i].release_date.split("-")[0]})`
          : "";
        const genre = dataResults[i].genre_ids
          .map((genre) => genres[genre])
          .join(", ");
        const overview = dataResults[i].overview;
        const movieId = dataResults[i].id;

        // Fetch Trailer
        const data = await fetchUrl(
          `https://api.themoviedb.org/3/movie/${movieId}/videos`
        );
        const videoPath =
          data.results.find((video) => video.name.includes("Trailer"))?.key ||
          data.results[0]?.key;

        // Remove old modal
        modal.innerHTML = "";

        // Insert new modal with new movie data
        const html = `
      <button class="close">&times;</button>
      <article class="movie-info">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/${videoPath}/"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>

        <div class="movie-data">
          <h3 class="movie-title">
            ${movieTitle}
            <span class="movie-release">${releaseYear}</span>
          </h3>

          <p class="movie-genre">${genre}</p>
          <p class="movie-overview">${overview}</p>
        </div>
      </article>`;
        modal.insertAdjacentHTML("afterbegin", html);
        modal.style.display = "block";

        // close button
        const close = document.querySelector(".close");
        close.addEventListener("click", () => {
          modal.innerHTML = "";
          modal.style.display = "none";
        });

        // close modal using escape
        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape") {
            modal.innerHTML = "";
            modal.style.display = "none";
          }
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}

// FILTER
function displayFilter() {
  Object.entries(genres).forEach((genre) => {
    const html = `
    <option value="${genre[0]}">${genre[1]}</option>
    `;
    btnFilter.insertAdjacentHTML("beforeend", html);
  });
}
// Display filter
displayFilter();

// Click FIlter
btnFilter.addEventListener("change", () => {
  displaySearchResult(Number(btnFilter.value), btnSort.value);
});

// PAGINATION
btnNext.addEventListener("click", () => {
  if (current_page < numPage()) {
    current_page++;
    elPage.innerHTML = `page ${current_page}/${numPage()}`;
    console.log(current_page);
    displaySearchResult(Number(btnFilter.value), btnSort.value);
  }
});

btnPrev.addEventListener("click", () => {
  if (current_page > 1) {
    current_page--;
    elPage.innerHTML = `page ${current_page}/${numPage()}`;
    console.log(current_page);
    displaySearchResult(Number(btnFilter.value), btnSort.value);
  }
});

function numPage() {
  return Math.ceil(searchResults.length / records_per_page);
}
