import axios from 'axios';

export const getMovieList = async (page) => {
    const movie = await axios.get(`${process.env.REACT_APP_BASEURL}/movie/popular?page=${page}&api_key=${process.env.REACT_APP_APIKEY}`)
    return movie.data.results
}

export const searchMovie = async (q, page) => {
    const search = await axios.get(`${process.env.REACT_APP_BASEURL}/search/movie?query=${q}&page=${page}&api_key=${process.env.REACT_APP_APIKEY}`)
    return search.data
}

export const getMovieDetails = async (id) => {
    const movie = await axios.get(`${process.env.REACT_APP_BASEURL}/movie/${id}?api_key=${process.env.REACT_APP_APIKEY}`)
    return movie.data
}