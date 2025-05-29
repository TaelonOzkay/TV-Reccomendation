async function getData(query) {
  const url = "https://api.themoviedb.org/3/search/movie?query=" + query.replaceAll(" ","+");
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZDk2YzNhMmY5YjVhZTA2OTQ2NzdhM2Q2NWY0Y2UwMCIsIm5iZiI6MTc0Nzc3ODQ2OC44NjMwMDAyLCJzdWIiOiI2ODJjZmJhNGQ1YjIxZjYzNjg2NDk3NWQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.O9QraJ6bvIda9ouICAyq434tDUpybtw6yHf2lpRfa8g"
      }
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
    return;
  }
}

const searchInput = document.getElementById("search-input");
const searchList = document.getElementById("search-results");
const recommendationButton = document.getElementById("get-recommendations");

const watchedMovies = [];

recommendationButton.addEventListener("click", async function(event){
});

searchInput.addEventListener("input", async function(event){
  const movieData = await getData(searchInput.value);
  console.log(movieData);
  searchList.innerHTML = "";
  for (const result of movieData.results){
    const resultEl = document.createElement("div");
    resultEl.id = result.title;
    resultEl.textContent = result.title + ": " + result["genre_ids"].join(",");
    const resultImgEl = document.createElement("img");
    resultImgEl.src = "https://image.tmdb.org/t/p/w500/" + result["backdrop_path"]
    const resultButton = document.createElement("button");
    resultButton.appendChild(resultImgEl);
    resultEl.appendChild(resultButton);
    searchList.appendChild(resultEl);
  }
  // searchList.textContent = movieData.results.map(result => result.title);
});