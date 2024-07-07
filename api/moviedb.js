import axios from "axios"
import { apiKey } from "../constants"

const apiBaseUrl = `https://api.themoviedb.org/3`
// movies
const trendingMoviesEndpoint = `${apiBaseUrl}/trending/movie/day?api_key=${apiKey}`
const upcomingMoviesEndpoint = `${apiBaseUrl}/movie/upcoming?api_key=${apiKey}`
const topratedMoviesEndpoint = `${apiBaseUrl}/movie/top_rated?api_key=${apiKey}`
const movieDetailsEndpoint = id => `${apiBaseUrl}/movie/${id}?api_key=${apiKey}`
const movieCreditsEndpoint = id => `${apiBaseUrl}/movie/${id}/credits?api_key=${apiKey}`
const similarMoviesEndpoint = id => `${apiBaseUrl}/movie/${id}/similar?api_key=${apiKey}`
const personDetailsEndPoint = id => `${apiBaseUrl}/person/${id}?api_key=${apiKey}`
const personMoviesEndpoint = id => `${apiBaseUrl}/person/${id}/movie_credits?api_key=${apiKey}`
const searchMovieEndpoint = `${apiBaseUrl}/search/movie?api_key=${apiKey}`
const movieVideosEndpoint = id => `${apiBaseUrl}/movie/${id}/videos?api_key=${apiKey}`
// tv series
const trendingTvSeriesEndpoint = `${apiBaseUrl}/trending/tv/day?api_key=${apiKey}`
const onTheAirTvSeriesEndpoint = `${apiBaseUrl}/tv/on_the_air?api_key=${apiKey}`
const airingTodayTvSeriesEndpoint = `${apiBaseUrl}/tv/airing_today?api_key=${apiKey}`
const popularTvSeriesEndpoint = `${apiBaseUrl}/tv/popular?api_key=${apiKey}`
const topRatedTvSeriesEndpoint = `${apiBaseUrl}/tv/top_rated?api_key=${apiKey}`
const tvSeriesDetailsEndpoint = id => `${apiBaseUrl}/tv/${id}?api_key=${apiKey}`
const tvSeriesVideosEndpoint = id => `${apiBaseUrl}/tv/${id}/videos?api_key=${apiKey}`
const tvSeriesCreditsEndpoint = id => `${apiBaseUrl}/tv/${id}/credits?api_key=${apiKey}`
const similarTvSeriesEndpoint = id => `${apiBaseUrl}/tv/${id}/similar?api_key=${apiKey}`
const tvSeriesSeasonDetailsEndpoint = (series_id, season_number) => `${apiBaseUrl}/tv/${series_id}/season/${season_number}?api_key=${apiKey}`
const searchTvSeriesEndpoint = `${apiBaseUrl}/search/tv?api_key=${apiKey}`
const tvSeriesEpisodeCreditsEndpoint = (series_id, season_number, episode_number) => `${apiBaseUrl}/tv/${series_id}/season/${season_number}/episode/${episode_number}/credits?api_key=${apiKey}`
const tvSeriesEpisodeVideosTrailerEndpoint = (series_id, season_number, episode_number) => `${apiBaseUrl}/tv/${series_id}/season/${season_number}/episode/${episode_number}/videos?api_key=${apiKey}`

const apiCall = async (endpoint, params) => {
    const options = {
        method: 'GET',
        url: endpoint,
        params: params ? params : {},
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

export const searchTVSeries = (params) => {
    return apiCall(searchTvSeriesEndpoint, params)
}

export const fetchTrendingTvSeries = () => {
    return apiCall(trendingTvSeriesEndpoint)
}

export const fetchOnTheAirTvSeries = () => {
    return apiCall(onTheAirTvSeriesEndpoint)
}

export const fetchAiringTodayTvSeries = () => {
    return apiCall(airingTodayTvSeriesEndpoint)
}

export const fetchPopularTvSeries = () => {
    return apiCall(popularTvSeriesEndpoint)
}

export const fetchTopRatedTvSeries = () => {
    return apiCall(topRatedTvSeriesEndpoint)
}

export const fetchTvSeriesDetails = (id) => {
    return apiCall(tvSeriesDetailsEndpoint(id))
}

export const fetchMovieTrailerVideos = (id) => {
    return apiCall(movieVideosEndpoint(id))
}

export const fetchTvSeriesSeasonDetails = (series_id, season_number) => {
    return apiCall(tvSeriesSeasonDetailsEndpoint(series_id, season_number))
}

export const fetchSimilarTvSeries = (id) => {
    return apiCall(similarTvSeriesEndpoint(id))
}

export const fetchTvSeriesCredits = (id) => {
    return apiCall(tvSeriesCreditsEndpoint(id))
}

export const fetchTvSeriesEpisodeCredits = (series_id, season_number, episode_number) => {
    return apiCall(tvSeriesEpisodeCreditsEndpoint(series_id, season_number, episode_number))
}

export const fetchTvSeriesEpisodeTrailerVideos = (series_id, season_number, episode_number) => {
    return apiCall(tvSeriesEpisodeVideosTrailerEndpoint(series_id, season_number, episode_number))
}

export const fetchTvSeriesVideos = (id) => {
    return apiCall(tvSeriesVideosEndpoint(id))
}