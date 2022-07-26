const autocompleteConfig = {
    renderOption(movie) {
        const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src="${imgSRC}"/>
        ${movie.Title} (${movie.Year})
    `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(query) {
        const response = await axios.get('http://www.omdbapi.com', {
            params: {
                apikey: '35e75b8a',
                s: query
            }
        });
        if(response.data.Error) return [];
    
        return response.data.Search;
    }
}

createAutocomplete({
    ...autocompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});

createAutocomplete({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftMovie, rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {
            apikey: '35e75b8a',
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTeplate(response.data);

    side === 'left' ? leftMovie = response.data : rightMovie = response.data;
    if(leftMovie && rightMovie) runComparison();
}

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];
        
        const leftSideValue = Number(leftStat.dataset.value);
        const rightSideValue = Number(rightStat.dataset.value);

        if(rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    })
}

const movieTeplate = (movieDetail) => {
    const dollars = Number(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = Number(movieDetail.Metascore);
    const imdbRating = Number(movieDetail.imdbRating);
    const imdbVotes = Number(movieDetail.imdbVotes.replace(/,/g, ''));

    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = Number(word);
        if(isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);
    console.log(awards)

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
    <article data-value="${awards}" class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value="${dollars}" class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    <article data-value="${metascore}" class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article data-value="${imdbRating}" class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDb Rating</p>
    </article>
    <article data-value="${imdbVotes}" class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDb Votes</p>
    </article>
    `;
}