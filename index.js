const fetchData = async (query) => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {
            apikey: '35e75b8a',
            s: query
        }
    });
    console.log(response.data)
}

const input = document.querySelector('input');
input.addEventListener('input', (event) => {
    fetchData(event.target.value);
})