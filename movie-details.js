async function getMovieDetails(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ru-RU`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении деталей фильма:', error);
        return null;
    }
}

async function getMovieVideos(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
        const data = await response.json();
        return data.results.find(video => video.type === "Trailer") || data.results[0];
    } catch (error) {
        console.error('Ошибка при получении трейлера:', error);
        return null;
    }
}

async function displayMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        window.location.href = 'index.html';
        return;
    }

    const movie = await getMovieDetails(movieId);
    const video = await getMovieVideos(movieId);
    const container = document.getElementById('movieDetails');

    if (movie) {
        const trailerHtml = video 
            ? `<div class="trailer-container">
                <h2>Трейлер</h2>
                <iframe src="https://www.youtube.com/embed/${video.key}" allowfullscreen></iframe>
               </div>`
            : '';

        container.innerHTML = `
            <div class="movie-header">
                <img class="movie-poster" src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                <div class="movie-info-detailed">
                    <h1 class="movie-title-large">${movie.title}</h1>
                    <div class="movie-meta">
                        <p>Дата выхода: ${movie.release_date}</p>
                        <p>Рейтинг: ★ ${movie.vote_average.toFixed(1)}</p>
                        <p>Жанры: ${movie.genres.map(genre => genre.name).join(', ')}</p>
                    </div>
                    <div class="movie-overview">
                        <h2>Описание</h2>
                        <p>${movie.overview}</p>
                    </div>
                </div>
            </div>
            ${trailerHtml}
        `;
    }
}

displayMovieDetails();