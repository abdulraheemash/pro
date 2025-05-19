import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/MovieDetails.css';
import Ratings from '../components/Ratings';
import EditDeleteForm from '../components/EditDeleteForm';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/movies/${id}`)
      .then(res => setMovie(res.data))
      .catch(err => console.error('Error fetching movie:', err));
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Delete this movie?')) {
      axios.delete(`http://localhost:5000/movie/${id}`) // <-- consistent DELETE endpoint
        .then(() => {
          alert('Movie deleted.');
          navigate('/');
        })
        .catch(err => console.error('Error deleting movie:', err));
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleMovieUpdated = (updatedMovie) => {
    setMovie(updatedMovie);
    setIsEditing(false);
  };

  const handleMovieDeleted = () => {
    navigate('/movielist');
  };

  if (!movie) return <p className="loading">Loading...</p>;

  return (
    <div className="app">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🎬 Movie Details</h2>

      {isEditing ? (
        <EditDeleteForm
          movie={movie}
          onClose={handleCloseEdit}
          onMovieUpdated={handleMovieUpdated}
          onMovieDeleted={handleMovieDeleted}
        />
      ) : (
        <div className="movie-card-detail">
          <h1>{movie.title}</h1>
          <p><strong>Genre:</strong> {movie.genre}</p>
          <p><strong>Year:</strong> {movie.release_year}</p>
          <Ratings initialRating={movie.rating} disabled />
          <p><strong>Language:</strong> {movie.language}</p>
          <p><strong>Notes:</strong> {movie.notes || 'N/A'}</p>
          <p><strong>Added:</strong> {new Date(movie.created_at).toLocaleString()}</p>

          <div className="button-group-detail">
            <button className="edit-btn" onClick={handleEditClick}>Edit</button>
            <button className="delete-btn" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;
