export type MediaType = 'movie' | 'tv';

export interface Genre {
  id: number;
  name: string;
}

export interface MediaItem {
  id: number;
  media_type?: MediaType;
  title?: string;
  name?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
}

export interface MovieDetails extends MediaItem {
  title: string;
  status?: string;
  release_date?: string;
  runtime?: number;
  genres?: Genre[];
}

export interface SeasonSummary {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path?: string | null;
}

export interface TvSeriesDetails extends MediaItem {
  name: string;
  status?: string;
  first_air_date?: string;
  number_of_seasons?: number;
  genres?: Genre[];
  seasons?: SeasonSummary[];
}

export interface CastMember {
  id: number;
  character?: string;
  name?: string;
  original_name?: string;
  profile_path?: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
}

export interface Episode {
  id: number;
  name: string;
  overview?: string;
  runtime?: number;
  episode_number: number;
  guest_stars?: CastMember[];
}

export interface SeasonDetails extends SeasonSummary {
  air_date?: string;
  overview?: string;
  episodes?: Episode[];
}

export interface PersonDetails {
  id: number;
  name?: string;
  biography?: string;
  birthday?: string;
  gender?: number;
  known_for_department?: string;
  place_of_birth?: string;
  popularity?: number;
  profile_path?: string | null;
}

export interface ListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface CreditsResponse {
  cast: CastMember[];
}

export interface PersonCreditsResponse {
  cast: MediaItem[];
}

export interface VideosResponse {
  results: Video[];
}
