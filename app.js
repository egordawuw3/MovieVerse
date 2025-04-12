let currentPage = 1;
let currentSearch = '';
let currentSort = 'popularity';
let isDescending = true;

async function fetchMovies(page, search = '') {
    const endpoint = search 
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${search}&page=${page}&language=ru-RU`
        : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}&language=ru-RU`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return null;
    }
}

function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    
    const imageUrl = movie.poster_path 
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    movieCard.innerHTML = `
        <img src="${imageUrl}" alt="${movie.title}">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <span class="movie-rating">★ ${movie.vote_average.toFixed(1)}</span>
        </div>
    `;

    movieCard.addEventListener('click', () => {
        window.location.href = `movie-details.html?id=${movie.id}`;
    });

    return movieCard;
}

function sortMovies(movies) {
    return movies.sort((a, b) => {
        const modifier = isDescending ? -1 : 1;
        
        switch(currentSort) {
            case 'rating':
                return (a.vote_average - b.vote_average) * modifier;
            case 'date':
                return (new Date(a.release_date) - new Date(b.release_date)) * modifier;
            case 'popularity':
            default:
                return (a.popularity - b.popularity) * modifier;
        }
    });
}

async function displayMovies(page, search = '') {
    const moviesContainer = document.getElementById('moviesContainer');
    moviesContainer.innerHTML = '';

    const data = await fetchMovies(page, search);
    if (!data) return;

    const sortedMovies = sortMovies([...data.results]);
    
    sortedMovies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesContainer.appendChild(movieCard);
    });

    document.getElementById('currentPage').textContent = page;
}

// Add these new event listeners after your existing ones:
document.getElementById('sortSelect').addEventListener('change', (e) => {
    currentSort = e.target.value;
    displayMovies(currentPage, currentSearch);
});

document.getElementById('sortOrderButton').addEventListener('click', (e) => {
    isDescending = !isDescending;
    e.target.textContent = isDescending ? '↓' : '↑';
    displayMovies(currentPage, currentSearch);
});

// Event Listeners
document.getElementById('searchButton').addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput');
    currentSearch = searchInput.value;
    currentPage = 1;
    displayMovies(currentPage, currentSearch);
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        currentSearch = e.target.value;
        currentPage = 1;
        displayMovies(currentPage, currentSearch);
    }
});

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayMovies(currentPage, currentSearch);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    displayMovies(currentPage, currentSearch);
});

// Initial load
displayMovies(currentPage);