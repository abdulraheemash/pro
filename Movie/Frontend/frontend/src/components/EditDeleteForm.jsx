



import React, { useState } from 'react';
import '../css/EditDelete.css';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate

function EditDeleteForm({ movie, onClose, onMovieUpdated, onMovieDeleted }) {
  const [form, setForm] = useState({ ...movie });
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating) => {
    setForm((prev) => ({ ...prev, rating }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/movie/${movie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Movie updated!');
        onMovieUpdated(form);
        navigate(`/movies/${movie.id}`); // ✅ Navigate to MovieDetails page
      } else {
        alert(result.error || 'Update failed.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;

    try {
      const res = await fetch(`http://localhost:5000/movie/${movie.id}`, {
        method: 'DELETE',
      });

      const result = await res.json();
      if (res.ok) {
        alert('Movie deleted!');
        navigate('/movies/6')
        onMovieDeleted();
      } else {
        alert(result.error || 'Delete failed.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  return (
    <div className="edit-container">
      <h3 className="edit-title">Edit Movie</h3>

      <label className="edit-label">Title:</label>
      <input
        className="edit-input"
        name="title"
        value={form.title}
        onChange={handleChange}
      />

      <label className="edit-label">Genre:</label>
      <input
        className="edit-input"
        name="genre"
        value={form.genre}
        onChange={handleChange}
      />

      <label className="edit-label">Release Year:</label>
      <input
        className="edit-input"
        name="release_year"
        value={form.release_year}
        onChange={handleChange}
      />

      <label className="edit-label">Rating:</label>
      <div className="edit-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRatingClick(star)}
            className={star <= form.rating ? 'star selected' : 'star'}
          >
            {star <= form.rating ? '★' : '☆'}
          </span>
        ))}
      </div>

      <label className="edit-label">Language:</label>
      <input
        className="edit-input"
        name="language"
        value={form.language}
        onChange={handleChange}
      />

      <label className="edit-label">Notes:</label>
      <textarea
        className="edit-input"
        name="notes"
        value={form.notes}
        onChange={handleChange}
        rows="4"
      />

      <div className="edit-buttons">
        <button className="edit-btn" onClick={handleUpdate}>
          Save
        </button>
        <button className="edit-btn" onClick={onClose}>
          Cancel
        </button>
        <button className="edit-btn delete" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default EditDeleteForm;