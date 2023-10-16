const elMovieList = document.querySelector(".movie-list");
const elMovieImg = document.querySelector(".movie-image");
const elMovieTitle = document.querySelector(".movie-title");
const elMovieGenre = document.querySelector(".movie-genre");
const btnDetails = document.querySelector(".movie-details");
const btnSearch = document.querySelector(".btn-search");
const elSearchBar = document.querySelector("#search-bar");
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
  878: "Science Fiction",
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
// Generate an array of 6 random number (to generate movie)
const randomMovies = Array.from({ length: 10 }, () =>
  Math.floor(Math.random() * 19 + 1)
);

// Fetch movie
const movie = async function () {
  try {
    const res = await fetch(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      options
    );
    const data = await res.json();
    console.log(data.results);

    // RECENTLY RELEASE
    const displayReMovie = function (n) {
      const imgSrc = `https://image.tmdb.org/t/p/w500${data.results[n].poster_path}`;
      const movieTitle = data.results[n].title;
      const genre = data.results[n].genre_ids.map((n) => genres[n]);
      const overview = data.results[n].overview.slice(0, 115);

      const html = `
  <article class="movie-info">
    <img
      src=${imgSrc}
      alt=${movieTitle}
      class="movie-image"
    />
    <div class="movie-data">
      <h3 class="movie-title">${movieTitle}</h3>
      <p class="movie-genre">${genre.join(", ")},...</p>
      <p class="movie-overview">${overview}... See more</p>
    </div>
</article>`;
      elMovieList.insertAdjacentHTML("afterbegin", html);
    };

    // LOOP AND DISPLAY 6 MOVIE
    console.log(randomMovies);
    randomMovies.forEach((i) => displayReMovie(i));
    // for (let i = 6; i <= 12; i++) {
    //   displayReMovie(i);
    // }}
  } catch (err) {
    console.log(err);
  }
};
movie();

// SEARCH FEATURE
btnSearch.addEventListener("click", (e) => {
  e.preventDefault();
  const value = elSearchBar.value;
  console.log(value);
});
