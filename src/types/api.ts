export interface Movie {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  tagline?: string;
  runtime?: number;
  budget?: number;
  revenue?: number;
  status?: string;
  genre_ids?: number[];
  genres?: Genre[];
  production_companies?: { id: number; name: string; logo_path?: string }[];
  spoken_languages?: { name: string }[];
}

export interface Person {
  id: number;
  name: string;
  profile_path?: string;
  gender?: number;
  biography?: string;
}

export interface Genre {
  id: number;
  name: string;
  selected?: boolean;
}

export interface Credits {
  cast?: {
    id: number;
    name: string;
    character: string;
    profile_path?: string;
  }[];
  crew?: { id: number; name: string; job: string }[];
}

export interface APIResponse<T = any> {
  results: T[];
  page?: number;
  total_pages?: number;
  total_results?: number;
}

export interface MovieKeywordsResponse {
  keywords: { id: number; name: string }[];
}

export interface MovieVideosResponse {
  results: { id: string; key: string; type: string; site: string }[];
}

export type ApiData = Record<string, any>;
export type SearchResult = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  profile_path?: string;
  gender?: number;
  release_date?: string;
};
