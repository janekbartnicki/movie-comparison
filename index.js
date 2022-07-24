const fetchData = async query => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {
            apikey: '35e75b8a',
            s: query
        }
    });
    return response.data.Srearch;
}

const input = document.querySelector('input');

const onInput = async event => {
    const movies = await fetchData(event.target.value);
    console.log(movies)
}
input.addEventListener('input', debunce(onInput, 500));