import {apiKey} from '../constants';
import type {
  CreditsResponse,
  ListResponse,
  MediaItem,
  MovieDetails,
  PersonCreditsResponse,
  PersonDetails,
  SeasonDetails,
  TvSeriesDetails,
  VideosResponse,
} from '../types';

const apiBaseUrl = 'https://api.themoviedb.org/3';
const endpoint = (path: string) => `${apiBaseUrl}${path}?api_key=${apiKey}`;

const trendingMoviesEndpoint = endpoint('/trending/movie/day');
const upcomingMoviesEndpoint = endpoint('/movie/upcoming');
const topRatedMoviesEndpoint = endpoint('/movie/top_rated');
const movieDetailsEndpoint = (id: number) => endpoint(`/movie/${id}`);
const movieCreditsEndpoint = (id: number) => endpoint(`/movie/${id}/credits`);
const similarMoviesEndpoint = (id: number) => endpoint(`/movie/${id}/similar`);
const personDetailsEndpoint = (id: number) => endpoint(`/person/${id}`);
const personMoviesEndpoint = (id: number) =>
  endpoint(`/person/${id}/movie_credits`);
const searchMovieEndpoint = endpoint('/search/movie');
const movieVideosEndpoint = (id: number) => endpoint(`/movie/${id}/videos`);

const trendingTvSeriesEndpoint = endpoint('/trending/tv/day');
const onTheAirTvSeriesEndpoint = endpoint('/tv/on_the_air');
const airingTodayTvSeriesEndpoint = endpoint('/tv/airing_today');
const popularTvSeriesEndpoint = endpoint('/tv/popular');
const topRatedTvSeriesEndpoint = endpoint('/tv/top_rated');
const tvSeriesDetailsEndpoint = (id: number) => endpoint(`/tv/${id}`);
const tvSeriesVideosEndpoint = (id: number) => endpoint(`/tv/${id}/videos`);
const tvSeriesCreditsEndpoint = (id: number) => endpoint(`/tv/${id}/credits`);
const similarTvSeriesEndpoint = (id: number) => endpoint(`/tv/${id}/similar`);
const tvSeriesSeasonDetailsEndpoint = (
  seriesId: number,
  seasonNumber: number,
) => endpoint(`/tv/${seriesId}/season/${seasonNumber}`);
const searchTvSeriesEndpoint = endpoint('/search/tv');
const tvSeriesEpisodeCreditsEndpoint = (
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number,
) =>
  endpoint(
    `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/credits`,
  );
const tvSeriesEpisodeVideosEndpoint = (
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number,
) =>
  endpoint(
    `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/videos`,
  );

type QueryParams = Record<string, string | number | boolean | null | undefined>;

const apiCall = async <T>(
  requestEndpoint: string,
  params: QueryParams = {},
): Promise<T | null> => {
  const url = new URL(requestEndpoint);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers: {Accept: 'application/json'},
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`TMDB request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error('TMDB request failed', error);
    return null;
  }
};

const imageUrl = (size: string, path?: string | null) =>
  path ? `https://image.tmdb.org/t/p/${size}/${path}` : null;

export const image500 = (path?: string | null) => imageUrl('w500', path);
export const image342 = (path?: string | null) => imageUrl('w342', path);
export const image185 = (path?: string | null) => imageUrl('w185', path);

export const fallbackMoviePoster =
  'https://www.wycliffe.ca/wp-content/uploads/bb-plugin/cache/member-fallback-user-image-300x300-circle-4b1323daf0b95dbc95352417464ca5d3-605afc59e679f.png';
export const fallbackPersonImage = fallbackMoviePoster;

export const fetchTrendingMovies = () =>
  apiCall<ListResponse<MediaItem>>(trendingMoviesEndpoint);
export const fetchUpcomingMovies = () =>
  apiCall<ListResponse<MediaItem>>(upcomingMoviesEndpoint);
export const fetchTopRatedMovies = () =>
  apiCall<ListResponse<MediaItem>>(topRatedMoviesEndpoint);
export const fetchMovieDetails = (id: number) =>
  apiCall<MovieDetails>(movieDetailsEndpoint(id));
export const fetchMovieCredits = (id: number) =>
  apiCall<CreditsResponse>(movieCreditsEndpoint(id));
export const fetchSimilarMovies = (id: number) =>
  apiCall<ListResponse<MediaItem>>(similarMoviesEndpoint(id));
export const fetchPersonDetails = (id: number) =>
  apiCall<PersonDetails>(personDetailsEndpoint(id));
export const fetchPersonMovies = (id: number) =>
  apiCall<PersonCreditsResponse>(personMoviesEndpoint(id));
export const searchMovies = (params: QueryParams) =>
  apiCall<ListResponse<MediaItem>>(searchMovieEndpoint, params);
export const searchTVSeries = (params: QueryParams) =>
  apiCall<ListResponse<MediaItem>>(searchTvSeriesEndpoint, params);
export const fetchTrendingTvSeries = () =>
  apiCall<ListResponse<MediaItem>>(trendingTvSeriesEndpoint);
export const fetchOnTheAirTvSeries = () =>
  apiCall<ListResponse<MediaItem>>(onTheAirTvSeriesEndpoint);
export const fetchAiringTodayTvSeries = () =>
  apiCall<ListResponse<MediaItem>>(airingTodayTvSeriesEndpoint);
export const fetchPopularTvSeries = () =>
  apiCall<ListResponse<MediaItem>>(popularTvSeriesEndpoint);
export const fetchTopRatedTvSeries = () =>
  apiCall<ListResponse<MediaItem>>(topRatedTvSeriesEndpoint);
export const fetchTvSeriesDetails = (id: number) =>
  apiCall<TvSeriesDetails>(tvSeriesDetailsEndpoint(id));
export const fetchMovieTrailerVideos = (id: number) =>
  apiCall<VideosResponse>(movieVideosEndpoint(id));
export const fetchTvSeriesSeasonDetails = (
  seriesId: number,
  seasonNumber: number,
) =>
  apiCall<SeasonDetails>(tvSeriesSeasonDetailsEndpoint(seriesId, seasonNumber));
export const fetchSimilarTvSeries = (id: number) =>
  apiCall<ListResponse<MediaItem>>(similarTvSeriesEndpoint(id));
export const fetchTvSeriesCredits = (id: number) =>
  apiCall<CreditsResponse>(tvSeriesCreditsEndpoint(id));
export const fetchTvSeriesEpisodeCredits = (
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number,
) =>
  apiCall<CreditsResponse>(
    tvSeriesEpisodeCreditsEndpoint(seriesId, seasonNumber, episodeNumber),
  );
export const fetchTvSeriesEpisodeTrailerVideos = (
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number,
) =>
  apiCall<VideosResponse>(
    tvSeriesEpisodeVideosEndpoint(seriesId, seasonNumber, episodeNumber),
  );
export const fetchTvSeriesVideos = (id: number) =>
  apiCall<VideosResponse>(tvSeriesVideosEndpoint(id));
