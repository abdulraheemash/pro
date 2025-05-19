import React from 'react';
import { Link } from 'react-router-dom';
import '../css/MovieList.css';

function MovieList({ movies }) {
  if (!movies.length) {
    return <p>No movies found.</p>;
  }

  return (
    <div className="movieList">
      {movies.map(movie => (
        <Link to={`/movies/${movie.id}`} key={movie.id} className="movieCard-link">
          <div className="movieCard">
            <h3>{movie.title}</h3>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>Year:</strong> {movie.release_year}</p>
            <p><strong>Rating:</strong> ⭐ {movie.rating ?? 'N/A'}</p>
            <p><strong>Language:</strong> {movie.language}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default MovieList;
