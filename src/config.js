// const API_BASE_URL = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_9Yid9AbcBx9etBpxOefnJm0Scrhdb'
// import.meta.env.VITE_API_KEY;
// const API_BASE_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.VITE_API_KEY}`

const API_BASE_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${import.meta.env.VITE_API_KEY}`


export default API_BASE_URL;
