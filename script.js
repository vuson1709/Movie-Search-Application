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
// // Approach 1: Generate an array of 6 random number (to generate movie) => this will create duplicate elements
// const randomMovies = Array.from({ length: 10 }, () =>
//   Math.floor(Math.random() * 19 + 1)
// );

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

// // FAKE SEARCH
// searchResults = [
//   {
//     adult: false,
//     backdrop_path: null,
//     genre_ids: [],
//     id: 1178202,
//     original_language: "en",
//     original_title: "Loki",
//     overview:
//       "An autorickshaw driver is known to be a notorious womaniser. What happens when he meets Kavitha? Will she change his life forever?",
//     popularity: 18.567,
//     poster_path: null,
//     release_date: "",
//     title: "Loki",
//     video: false,
//     vote_average: 0,
//     vote_count: 0,
//   },
//   {
//     adult: false,
//     backdrop_path: "/7NMVF3Af9wGvH3ceKaDUWuWUAt4.jpg",
//     genre_ids: [18],
//     id: 914203,
//     original_language: "fr",
//     original_title: "Tori et Lokita",
//     overview:
//       "In Belgium today, a young boy and an adolescent girl who have travelled alone from Africa pit their invincible friendship against the difficult conditions of their exile.",
//     popularity: 13.394,
//     poster_path: "/aJCedM9kp6k491Gb4cCj7R5n1il.jpg",
//     release_date: "2022-10-05",
//     title: "Tori and Lokita",
//     video: false,
//     vote_average: 6.912,
//     vote_count: 57,
//   },
//   {
//     adult: false,
//     backdrop_path: "/bNiuvw5cZBAUZ7OtH7ZtHycWJlT.jpg",
//     genre_ids: [35],
//     id: 857910,
//     original_language: "es",
//     original_title: "Lokillo: nada es igual",
//     overview:
//       "Through songs and puns, comedian Lokillo Florez hilariously reviews how Latin Americans have adjusted to a new world where no-hugging policies prevail.",
//     popularity: 4.93,
//     poster_path: "/Aq0a9qdBVgWKVCy2OlFdZOCj3Iw.jpg",
//     release_date: "2021-08-12",
//     title: "Lokillo: Nothing's the Same",
//     video: false,
//     vote_average: 7.4,
//     vote_count: 18,
//   },
//   {
//     adult: false,
//     backdrop_path: "/jBUukLTCmXL79itbmK5JtQvImYS.jpg",
//     genre_ids: [16, 35, 10751],
//     id: 846214,
//     original_language: "en",
//     original_title: "The Simpsons: The Good, the Bart, and the Loki",
//     overview:
//       "Loki is banished from Asgard once again and must face his toughest opponents yet: the Simpsons and Springfield’s mightiest heroes. The God of Mischief teams up with Bart Simpson in the ultimate crossover event paying tribute to the Marvel Cinematic Universe of superheroes and villains.",
//     popularity: 36.189,
//     poster_path: "/rtMdtzywcAGOrF6t8fbxJBqpdcq.jpg",
//     release_date: "2021-07-07",
//     title: "The Simpsons: The Good, the Bart, and the Loki",
//     video: false,
//     vote_average: 7.334,
//     vote_count: 629,
//   },
//   {
//     adult: false,
//     backdrop_path: "/ksI6YmzoIa2THVYkQJhcbWG5wMh.jpg",
//     genre_ids: [14, 27],
//     id: 83193,
//     original_language: "pl",
//     original_title: "Lokis: Rękopis profesora Wittembacha",
//     overview:
//       "A pastor studying folklore in remote parts of 19th century Lithuania is invited to stay with a young nobleman. His mother is sequestered and mad. It seems she has been attacked by a bear as a young wife and local peasants whisper the young man may be the son of a bear. A doctor, who treats the mother with old-fashioned remedies, reveals this to the pastor. Young nobleman's wife is found with a bite and the man has disappeared into the woods.",
//     popularity: 3.34,
//     poster_path: "/bGXPYRMAUjUOY3iMpWAmH3GQvzU.jpg",
//     release_date: "1970-09-25",
//     title: "Lokis, a Manuscript of Professor Wittembach",
//     video: false,
//     vote_average: 6.1,
//     vote_count: 13,
//   },
//   {
//     adult: false,
//     backdrop_path: "/vU70N8gYFVGqToFlU5PgyQDN5CO.jpg",
//     genre_ids: [14, 9648, 28, 37],
//     id: 567242,
//     original_language: "no",
//     original_title: "Lokes Datter",
//     overview:
//       "Loki's Daughter is the story about Loki and how he brought dark magic to the humans to challenge gods and create chaos.",
//     popularity: 0.831,
//     poster_path: "/uFhI3abgA3ju4raTKI1wB2kIV6c.jpg",
//     release_date: "2018-03-21",
//     title: "Loki's Daughter",
//     video: false,
//     vote_average: 0,
//     vote_count: 0,
//   },
//   {
//     adult: false,
//     backdrop_path: null,
//     genre_ids: [10751, 16, 28],
//     id: 899249,
//     original_language: "en",
//     original_title: "LEGO Marvel Avengers: Loki in Training",
//     overview:
//       'Loki declares he wants to be an Avenger, so Iron Man decides to make Loki an "Avenger In Training." It\'s a great plan until Thanos arrives on Earth looking for Loki.',
//     popularity: 3.9,
//     poster_path: "/eyBifMbovoQbyuNXHOFYo7tsInp.jpg",
//     release_date: "2021-11-01",
//     title: "LEGO Marvel Avengers: Loki in Training",
//     video: false,
//     vote_average: 6.917,
//     vote_count: 6,
//   },
//   {
//     adult: false,
//     backdrop_path: "/fDc5vMtnCDYGn7UJdeht2PqsqMg.jpg",
//     genre_ids: [35],
//     id: 412338,
//     original_language: "es",
//     original_title: "Loki 7",
//     overview:
//       "Álvaro and his friends try to scam a Dominican crime lord in order to pay off a debt to a Russian mobster.",
//     popularity: 3.613,
//     poster_path: "/1olLaXsFPh0mMHmTGuEjjv3Iz7q.jpg",
//     release_date: "2016-08-11",
//     title: "Loki 7",
//     video: false,
//     vote_average: 5.7,
//     vote_count: 3,
//   },
//   {
//     adult: false,
//     backdrop_path: "/1ZNLJkYSfRcPconjUYa5pReoLH9.jpg",
//     genre_ids: [99, 10402],
//     id: 62717,
//     original_language: "pt",
//     original_title: "Loki: Arnaldo Baptista",
//     overview:
//       "Loki brings the trajectory of Arnaldo Baptista from childhood, passing through the most successful phase as leader of the Mutantes, marriage to singer Rita Lee and then separation. He also goes through the depression that devastated his life after the group ended and that led him to attempt suicide, his solo career, rapprochement with his brother and member of the Mutantes, Sérgio Dias, culminating in the band's return in 2006.",
//     popularity: 8.157,
//     poster_path: "/cYl39kCMjP37e39CbJqxWHvf1ez.jpg",
//     release_date: "2009-06-19",
//     title: "Loki: Arnaldo Baptista",
//     video: false,
//     vote_average: 6.8,
//     vote_count: 13,
//   },
//   {
//     adult: false,
//     backdrop_path: null,
//     genre_ids: [99],
//     id: 580798,
//     original_language: "en",
//     original_title: "A Brothers' Journey: Thor & Loki",
//     overview:
//       "This Marvel Cinematic Universe documentary delves into the development, casting, character arcs and performances of Hemsworth's Thor and Hiddleston's Loki. Part 1 begins by focusing on the original Thor (2011) and Joss Whedon's Avengers, but soon ropes in Thor: The Dark World. Part 2 offers a more sequel-specific overview of the Asgardian brothers that features plenty of interview segments with key members of the cast and crew.",
//     popularity: 1.353,
//     poster_path: "/pZPk9wvO8HGH7TNJxkyT6BUMy1l.jpg",
//     release_date: "2014-02-25",
//     title: "A Brothers' Journey: Thor & Loki",
//     video: true,
//     vote_average: 8.7,
//     vote_count: 3,
//   },
//   {
//     adult: false,
//     backdrop_path: null,
//     genre_ids: [18, 27, 9648],
//     id: 1172769,
//     original_language: "cs",
//     original_title: "Lokis",
//     overview:
//       "After arriving at the mysterious castle, the university professor begins to encounter a sequence of mysterious events, to which he reacts with his rational thinking and tries to explain them logically.",
//     popularity: 1.804,
//     poster_path: null,
//     release_date: "1986-01-01",
//     title: "Lokis",
//     video: false,
//     vote_average: 0,
//     vote_count: 0,
//   },
//   {
//     adult: false,
//     backdrop_path: null,
//     genre_ids: [99],
//     id: 1092908,
//     original_language: "is",
//     original_title: "Lokinhamrar",
//     overview: "No description found",
//     popularity: 0.971,
//     poster_path: null,
//     release_date: "2000-01-01",
//     title: "Lokinhamrar",
//     video: false,
//     vote_average: 0,
//     vote_count: 0,
//   },
//   {
//     adult: false,
//     backdrop_path: null,
//     genre_ids: [],
//     id: 883501,
//     original_language: "en",
//     original_title: "Utgard Loki",
//     overview:
//       "Asgardian brothers Thor and Loki take a journey, by King Odin’s command, to a distant land known as Utgard.  There they will meet obscure and fantastical beings, discover more about their universe, and take part in a daring, deadly, and totally entertaining gameshow.  These brothers go off on a quest, but find themselves face to face with the greatest challenge of their lifetimes.",
//     popularity: 0.626,
//     poster_path: null,
//     release_date: "",
//     title: "Utgard Loki",
//     video: false,
//     vote_average: 0,
//     vote_count: 0,
//   },
//   {
//     adult: false,
//     backdrop_path: "/9DLbMAVTwBZr08ZVpRWiCaspFsU.jpg",
//     genre_ids: [16, 878, 35, 9648, 53],
//     id: 1175498,
//     original_language: "it",
//     original_title: "Loki - La Parodia",
//     overview: "",
//     popularity: 0.717,
//     poster_path: "/in8b5WKa8CVZvICsCw2XweW80pq.jpg",
//     release_date: "2021-12-15",
//     title: "Loki - La Parodia",
//     video: false,
//     vote_average: 10,
//     vote_count: 1,
//   },
//   {
//     adult: false,
//     backdrop_path: null,
//     genre_ids: [99],
//     id: 1192825,
//     original_language: "en",
//     original_title: "Marvel Studios Assembled: The Making of Loki: Season 2",
//     overview:
//       'Through candid interviews with the creative minds behind the show, and exclusive on-set footage, discover how the talented team that powered "Loki: Season 2" raised the stakes for this latest MCU adventure. Witness imaginative costumes, elaborate environments, and far-out variants come to life, meet new allies and foes, and time-slip across the Multiverse.',
//     popularity: 8.944,
//     poster_path: null,
//     release_date: "2023-11-29",
//     title: "Marvel Studios Assembled: The Making of Loki: Season 2",
//     video: false,
//     vote_average: 0,
//     vote_count: 0,
//   },
//   {
//     adult: false,
//     backdrop_path: "/f3SGepXZNToHtEs7wyd7QO8DIdY.jpg",
//     genre_ids: [35],
//     id: 840756,
//     original_language: "es",
//     original_title: "Mi otra yo",
//     overview:
//       "A controversial TV host and comedian who has built his career on sexist humor is forced to assume a woman's identity to elude a relentless drug dealer.",
//     popularity: 3.191,
//     poster_path: "/11z4nAYm1ZYIEzTvG0dzyKDBn6R.jpg",
//     release_date: "2021-06-15",
//     title: "Mi otra yo",
//     video: false,
//     vote_average: 6.3,
//     vote_count: 3,
//   },
// ];
// displaySearchResult();

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

  // Your main logic

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
