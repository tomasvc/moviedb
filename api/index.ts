const API_KEY = process.env.TMDB_API_KEY;

const API_ENDPOINTS = {
    popularMovies: `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,
    trendingMovies: `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`,
    multiSearch: `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`,
    movieGenres: `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
}

export async function fetchMovies(page: number) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
    if (!response.ok) {
        throw new Error("Failed to fetch movies")
    }
    return response.json()
  }

export async function fetchTrendingMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch movies")
    }
    return response.json()
}

export async function multiSearch(query: string) {
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${query}`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function movieSearch(query: string) {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${query}`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function personSearch(query: string) {
    const response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=en-US&query=${query}`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchMovieDetails(id: string) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchMovieCredits(id: string) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchMovieReviews(id: string) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchPersonDetails(id: string) {
    const response = await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchPersonExternals(id: string) {
    const response = await fetch(`https://api.themoviedb.org/3/person/${id}/external_ids?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchPersonCombinedCredits(id: string) {
    const response = await fetch(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchMovieKeywords(id: string) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/keywords?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchItemsByKeyword(id: string) {
    const response = await fetch(`https://api.themoviedb.org/3/keyword/${id}/movies?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchKeyword(id: string) {
    const response = await fetch(`https://api.themoviedb.org/3/keyword/${id}?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchSimilarMovies(id: string) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchRecommendedMovies(id: string) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchMovieImages(id: string) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchMovieVideos(id: string) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchPersonImages(id: string) {
    const response = await fetch(`https://api.themoviedb.org/3/person/${id}/images?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchCollection(id: string) {
    const response = await fetch(`https://api.themoviedb.org/3/collection/${id}?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }

export async function fetchMovieGenres() {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }
    

export const fetchDiscover = async (genres?: any[], country?: string, releaseYear?: any) => {
    const selectedGenres = [];
    genres.forEach(gen => gen.selected && selectedGenres.push(gen.id))
    const releaseYearParam = releaseYear?.type === "range" ? `&primary_release_date.gte=${releaseYear?.from + '-01-01'}&primary_release_date.lte=${releaseYear?.to + '-12-31'}` : releaseYear?.type === "exact" ? `&year=${releaseYear?.releaseYear}` : '';
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US${selectedGenres.length && `&with_genres=${selectedGenres.join(",")}`}${country && `&with_origin_country=${country}`}${releaseYearParam}`);
    if (!response.ok) {
        throw new Error("Failed to fetch")
    }
    return response.json()
    }