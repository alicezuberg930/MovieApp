import axios from "axios"
import { apiKey } from "../constants"

const apiBaseUrl = `https://api.themoviedb.org/3`
const trendingMoviesEndpoint = `${apiBaseUrl}/trending/movie/day?api_key=${apiKey}`
const upcomingMoviesEndpoint = `${apiBaseUrl}/movie/upcoming?api_key=${apiKey}`
const topratedMoviesEndpoint = `${apiBaseUrl}/movie/top_rated?api_key=${apiKey}`
const movieDetailsEndpoint = id => `${apiBaseUrl}/movie/${id}?api_key=${apiKey}`
const movieCreditsEndpoint = id => `${apiBaseUrl}/movie/${id}/credits?api_key=${apiKey}`
const similarMoviesEndpoint = id => `${apiBaseUrl}/movie/${id}/similar?api_key=${apiKey}`
const personDetailsEndPoint = id => `${apiBaseUrl}/person/${id}?api_key=${apiKey}`
const personMoviesEndpoint = id => `${apiBaseUrl}/person/${id}/movie_credits?api_key=${apiKey}`
const searchMovieEndpoint = `${apiBaseUrl}/search/movie?api_key=${apiKey}`

const apiCall = async (endpoint, params) => {
    const options = {
        method: 'GET',
        url: endpoint,
        params: params ? params : {},
        // headers: {
        //     accept: 'application/json',
        //     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZTAxZDQ1ODI2MDA3ZWIxNWQ2YWE1OWNiZWZkZDFjOCIsInN1YiI6IjY2NzJkNTI1MmZiOGJiYTI5NjE2OWNhYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8r5BPjO0H_Womp2_OH8OhorWzG7vUfWE-1a1VG4iZNM'
        // }
    }
    try {
        const response = await axios.request(options)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const image500 = (path) => path ? `https://image.tmdb.org/t/p/w500/${path}` : null
export const image342 = (path) => path ? `https://image.tmdb.org/t/p/w342/${path}` : null
export const image185 = (path) => path ? `https://image.tmdb.org/t/p/w185/${path}` : null

export const fallbackMoviePoster = 'https://www.wycliffe.ca/wp-content/uploads/bb-plugin/cache/member-fallback-user-image-300x300-circle-4b1323daf0b95dbc95352417464ca5d3-605afc59e679f.png'
export const fallbackPersonImage = 'https://www.wycliffe.ca/wp-content/uploads/bb-plugin/cache/member-fallback-user-image-300x300-circle-4b1323daf0b95dbc95352417464ca5d3-605afc59e679f.png'

export const fetchTrendingMovies = () => {
    return apiCall(trendingMoviesEndpoint)
}

export const fetchUpcomingMovies = () => {
    return apiCall(upcomingMoviesEndpoint)
}

export const fetchTopRatedMovies = () => {
    return apiCall(topratedMoviesEndpoint)
}

export const fetchMovieDetails = (id) => {
    return apiCall(movieDetailsEndpoint(id))
}

export const fetchMovieCredits = (id) => {
    return apiCall(movieCreditsEndpoint(id))
}

export const fetchSimilarMovies = (id) => {
    return apiCall(similarMoviesEndpoint(id))
}

export const fetchPersonDetails = (id) => {
    return apiCall(personDetailsEndPoint(id))
}

export const fetchPersonMovies = (id) => {
    return apiCall(personMoviesEndpoint(id))
}

export const searchMovies = (params) => {
    return apiCall(searchMovieEndpoint, params)
}