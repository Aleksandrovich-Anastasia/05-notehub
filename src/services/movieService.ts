import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';

interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(query: string): Promise<Movie[]> {
  try {
    const response = await axios.get<MoviesResponse>(`${BASE_URL}/search/movie`, {
      params: { query },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    });

    return response.data.results;
  } catch  {
    throw new Error('Failed to fetch movies');
  }
}
