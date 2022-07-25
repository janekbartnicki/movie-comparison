const fetchData = async query => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {
            apikey: '35e75b8a',
            s: query
        }
    });
    if(response.data.Error) return [];

    return response.data.Search;
}

createAutocomplete({
    root: document.querySelector('.autocomplete'),
    renderOption(movie) {
        const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src="${imgSRC}"/>
        ${movie.Title} (${movie.Year})
    `;
    }
});

const onMovieSelect = async movie => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {
            apikey: '35e75b8a',
            i: movie.imdbID
        }
    });

    document.querySelector('.summary').innerHTML = movieTeplate(response.data);
}

const movieTeplate = (movieDetail) => {
    return `
        <article class="media">
        <figure class="media-left">
        <p class="image">
            <img src="${movieDetail.Poster}" alt="">
        </p>
        </figure>
        <div class="media-contnet">
        <div class="content">
            <h1>${movieDetail.Title}</h1>
            <h4>${movieDetail.Genre}</h4>
            <p>${movieDetail.Plot}</p>
        </div>
        </div>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDb Rating</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDb Votes</p>
    </article>
    `;
}