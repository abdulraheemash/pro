import '../css/AddMovieForm.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Ratings from '../components/Ratings';
import { useNavigate } from 'react-router-dom';

const currentYear = new Date().getFullYear();

const AddMovieForm = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    genre: '',
    release_year: '',
    language: '',
    notes: '',
    rating: 0,
  });

  const [errors, setErrors] = useState({});

  // Reset form & errors when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({
        title: '',
        genre: '',
        release_year: '',
        language: '',
        notes: '',
        rating: 0,
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateField = (name, value) => {
    let error = '';
    if (name === 'title' && !value.trim()) {
      error = 'Title is required.';
    }
    if (name === 'genre' && !value.trim()) {
      error = 'Genre is required.';
    }
    if (name === 'release_year') {
      if (!value) {
        error = 'Release Year is required.';
      } else {
        const yearNum = Number(value);
        if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
          error = `Year must be between 1900 and ${currentYear}.`;
        }
      }
    }
    if (name === 'language' && !value.trim()) {
      error = 'Language is required.';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleRatingChange = (newRating) => {
    setForm((prev) => ({ ...prev, rating: newRating }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (key === 'rating') return;
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = {
      ...form,
      genre: form.genre.trim().toLowerCase(),
      language: form.language.trim().toLowerCase(),
    };

    try {
      await axios.post('http://localhost:5000/movies', formDataToSend);
      alert('Movie saved successfully!');
      setForm({
        title: '',
        genre: '',
        release_year: '',
        language: '',
        notes: '',
        rating: 0,
      });
      setErrors({});
      onClose(); // close the modal
      navigate('/');
    } catch (error) {
      if (error.response?.data?.message) {
        alert('Error: ' + error.response.data.message);
      } else {
        alert('Network or server error occurred.');
      }
    }
  };

  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside form
      >
        <form onSubmit={handleSubmit} className="add-movie-form">
          <h2>Add Movie</h2>

          <label htmlFor="title">Title *</label>
          <input
            type="text"
            name="title"
            id="title"
            value={form.title}
            onChange={handleChange}
          />
          {errors.title && <div className="error">{errors.title}</div>}

          <label htmlFor="genre">Genre *</label>
          <input
            type="text"
            name="genre"
            id="genre"
            value={form.genre}
            onChange={handleChange}
            placeholder="e.g., action"
          />
          {errors.genre && <div className="error">{errors.genre}</div>}

          <label htmlFor="release_year">Release Year *</label>
          <input
            type="number"
            name="release_year"
            id="release_year"
            value={form.release_year}
            onChange={handleChange}
            min="1900"
            max={currentYear}
          />
          {errors.release_year && <div className="error">{errors.release_year}</div>}

          <label htmlFor="language">Language *</label>
          <input
            type="text"
            name="language"
            id="language"
            value={form.language}
            onChange={handleChange}
            placeholder="e.g., english"
          />
          {errors.language && <div className="error">{errors.language}</div>}

          <Ratings initialRating={form.rating} onRatingChange={handleRatingChange} />

          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            name="notes"
            id="notes"
            value={form.notes}
            onChange={handleChange}
            rows="3"
          />

          <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovieForm;