class Movie {
  constructor(movieObject) {
    this.apiKey = "87dd0709";
    this.title = movieObject.Title;
    this.poster = movieObject.Poster;
    this.id = movieObject.imdbID;
  }

  createMovieCard() {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.classList.add("custom-card");

    const cardImg = document.createElement("img");
    cardImg.style.height = "30vh";
    if (this.poster != "N/A") {
      cardImg.setAttribute("src", this.poster);
    } else {
      cardImg.setAttribute(
        "src",
        "https://t3.ftcdn.net/jpg/03/34/83/22/360_F_334832255_IMxvzYRygjd20VlSaIAFZrQWjozQH6BQ.jpg"
      );
    }
    cardImg.classList.add("card-img-top");
    cardImg.style.overflow = "hidden";

    const bodyDiv = document.createElement("div");
    bodyDiv.classList.add("card-body");

    const h5Title = document.createElement("h5");
    h5Title.classList.add("card-title");
    h5Title.innerHTML = this.title;
    h5Title.style.fontWeight = "bold";
    h5Title.style.textAlign = "center";
    h5Title.style.marginTop = "2vh";
    h5Title.style.fontSize = "130%";

    cardDiv.appendChild(cardImg);
    bodyDiv.appendChild(h5Title);
    cardDiv.appendChild(bodyDiv);

    cardDiv.addEventListener("click", () => {
      this.cardClicked();
    });

    return cardDiv;
  }

  async cardClicked() {
    console.log("cardClicked", this.title);
    const restOfPage = document.getElementById("movies-container");

    if (!this.data) {
      console.log("Send request");
      this.data = await this.getMovieData();
    }

    const modal = document.getElementById("modal-container");
    const navBar = document.getElementById("myNav");
    const fooTer = document.getElementById("myFooter");
    const formSearch = document.getElementById("myFormSearch");

    navBar.style.opacity = "0.1";
    navBar.style.zIndex = "1";

    fooTer.style.opacity = "0.1";
    fooTer.style.zIndex = "1";

    formSearch.style.opacity = "0.1";
    formSearch.style.zIndex = "1";

    restOfPage.style.opacity = "0.1";
    restOfPage.style.zIndex = "1";

    modal.style.zIndex = "2";
    modal.style.opacity = "1.0";
    modal.style.display = "block";
    console.log(this.data);

    document.getElementById("movieTitle").innerHTML = this.data.Title;
    document.getElementById("releaseYear").innerText = this.data.Released;
    document.getElementById("movieDirector").innerHTML = this.data.Director;
    document.getElementById("moviePlot").innerHTML = this.data.Plot;

    const posterDiv = document.getElementById("img");
    if (this.poster != "N/A") {
      posterDiv.style.backgroundImage = `url('${this.poster}')`;
      posterDiv.style.backgroundRepeat = `no-repeat`;
    } else {
      posterDiv.style.backgroundImage = `url("https://t3.ftcdn.net/jpg/03/34/83/22/360_F_334832255_IMxvzYRygjd20VlSaIAFZrQWjozQH6BQ.jpg")`;
    }

    const ratingList = document.getElementById("ratings-list");
    this.data.Ratings.forEach((element) => {
      const rating = document.createElement("h6");
      rating.innerHTML = element.Source + ": " + element.Value;
      ratingList.appendChild(rating);
    });
  }

  async getMovieData() {
    try {
      const url =
        "https://www.omdbapi.com/?apikey=" + this.apiKey + "&i=" + this.id;

      console.log("URL:", url);

      const response = await fetch(url);
      const result = await response.json();

      return result;
    } catch (error) {
      return false;
    }
  }
}

class MovieSearcher {
  constructor() {
    this.page = 1;
    this.apiKey = "87dd0709";
    this.searchType = "movie";
    this.searchQuery = "";
    this.yearRelease = "2023";

    const searchForm = document.getElementById("search-form");
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();

      this.runSearch();
    });
  }

  async getMovies() {
    try {
      const spinnerLoading = document.getElementById("spinnerLoading");
      spinnerLoading.classList.add("spinner-show");

      const url =
        "https://www.omdbapi.com/?apikey=" +
        this.apiKey +
        "&type=" +
        this.searchType +
        "&s=" +
        encodeURIComponent(this.searchQuery) +
        "&page=" +
        this.page;

      console.log("URL:", url);

      const response = await fetch(url);
      const results = await response.json();
      console.log("resultados", results.Search);
      if (results.Search == undefined) {
        spinnerLoading.classList.remove("spinner-show");
        alert("No results found. Please try a differente search term");
      }
      spinnerLoading.classList.remove("spinner-show");
      return results.Search;
    } catch (error) {
      return [];
    }
  }

  async runSearch(e) {
    const container = document.getElementById("movies-container");

    this.searchQuery = document.getElementById("search-input").value;
    if (this.searchQuery) {
      container.innerHTML = "";

      const results = await this.getMovies();

      container.style.display = "flex";
      const movieObjects = [];
      results.forEach((item) => {
        const movie = new Movie(item);
        movieObjects.push(movie);
        const card = movie.createMovieCard();

        container.appendChild(card);
      });

      if (!results) return;
    } else {
      alert("Please insert a valid movie name.");
    }
  }
}

let movieSearcherInstance = null;

async function getNewMovies() {
  const url2 =
    "http://www.omdbapi.com/?apikey=87dd0709&s=hero&type=movie&y=2023";
  const url = "http://www.omdbapi.com/?y=2023";
  const result = await fetch(url2);
  const response = await result.json();
  console.log("resultado", response);
  if (response.Response === "True") {
    const movies = response.Search;
    const container = document.getElementById("movies-container");
    container.innerHTML = ""; // Clear existing content

    movies.forEach((movieData) => {
      const movie = new Movie(movieData);
      const card = movie.createMovieCard();
      container.appendChild(card);
    });
  } else {
    console.log("No movies found.");
  }
}

window.onload = () => {
  getNewMovies();
  movieSearcherInstance = new MovieSearcher();

  const closeButton = document.getElementById("closeButton");

  closeButton.addEventListener("click", closeMovieModal);
};

function closeMovieModal() {
  const modal = document.getElementById("modal-container");
  const navBar = document.getElementById("myNav");
  const fooTer = document.getElementById("myFooter");
  const formSearch = document.getElementById("myFormSearch");
  const restOfPage = document.getElementById("movies-container");

  modal.style.display = "none";
  navBar.style.backgroundColor = "white";
  navBar.style.opacity = "1";
  navBar.style.zIndex = "1";
  fooTer.style.backgroundColor = "white";
  fooTer.style.opacity = "1";
  fooTer.style.zIndex = "1";
  formSearch.style.backgroundColor = "white";
  formSearch.style.opacity = "1";
  formSearch.style.zIndex = "1";
  restOfPage.style.backgroundColor = "white";
  restOfPage.style.opacity = "1";
  restOfPage.style.zIndex = "1";
}

document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "87dd0709";

  async function fetchMovies() {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${apiKey}&s=&type=movie`
      );
      const data = await response.json();
      console.log("resposta", data);

      if (data.Response === "True") {
        const movies = data.Search;
        movies.forEach((movie) => {
          const movieTitle = movie.Title;
          const movieYear = movie.Year;
          const moviePoster = movie.Poster;

          console.log(movieYear);
        });
      } else {
        console.log("No movies found.");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }

  fetchMovies();
});
