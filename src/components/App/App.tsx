import { useState } from 'react';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import styles from './App.module.css';
import { Toaster, toast } from 'react-hot-toast';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(false);
    setMovies([]);

    try {
      const results = await fetchMovies(query);
      if (results.length === 0) {
        toast.error('No movies found for your request.');
      }
      setMovies(results);
    } catch {
      setError(true);
      toast.error('There was an error, please try again...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />
      
      {loading && <Loader />}
      {error && <ErrorMessage />}
      {!loading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}
      
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
