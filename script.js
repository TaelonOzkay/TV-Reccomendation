const API_KEY = 'ad96c3a2f9b5ae0694677a3d65f4ce00'; // Replace with your TMDB key
const BASE_URL = 'https://api.themoviedb.org/3';

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const watchedList = document.getElementById('watched-list');
const recommendationsContainer = document.getElementById('recommendations');
const getRecommendationsButton = document.getElementById('get-recommendations');

let watchedShows = [];

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  if (query.length < 2) return;
  searchTVShows(query);
});

getRecommendationsButton.addEventListener('click', () => {
  getRecommendations();
});

// 🔍 Search for TV shows
async function searchTVShows(query) {
  try {
    const res = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    displaySearchResults(data.results);
  } catch (error) {
    console.error('Search error:', error);
  }
}

// 📄 Display search results
function displaySearchResults(shows) {
  searchResults.innerHTML = '';
  shows.forEach(show => {
    const showCard = document.createElement('div');
    showCard.className = 'show-card';
    showCard.innerHTML = `
      <h3>${show.name}</h3>
      <p>${show.first_air_date?.slice(0, 4) || 'N/A'}</p>
      <button data-show='${JSON.stringify(show)}'>Add</button>
    `;
    showCard.querySelector('button').addEventListener('click', () => addToWatched(show));
    searchResults.appendChild(showCard);
  });
}

// ➕ Add show to watched list
function addToWatched(show) {
  if (watchedShows.find(s => s.id === show.id)) return; // Prevent duplicates
  watchedShows.push(show);

  const card = document.createElement('div');
  card.className = 'show-card';
  card.innerHTML = `<h3>${show.name}</h3><p>Added</p>`;
  watchedList.appendChild(card);
}

// 💡 Get recommendations based on watched shows
async function getRecommendations() {
  recommendationsContainer.innerHTML = '';

  const recommended = new Map(); // Avoid duplicates
  for (const show of watchedShows) {
    try {
      const res = await fetch(`${BASE_URL}/tv/${show.id}/recommendations?api_key=${API_KEY}`);
      const data = await res.json();
      data.results.forEach(rec => {
        if (!recommended.has(rec.id)) {
          recommended.set(rec.id, rec);
        }
      });
    } catch (err) {
      console.error(`Failed to get recommendations for ${show.name}`, err);
    }
  }

  recommended.forEach(show => {
    const card = document.createElement('div');
    card.className = 'show-card';
    card.innerHTML = `
      <h3>${show.name}</h3>
      <p>${show.first_air_date?.slice(0, 4) || 'N/A'}</p>
    `;
    recommendationsContainer.appendChild(card);
  });
}
