import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Search.css';


function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/movies?q=${value}`);
      if (res.data.length === 0) {
        setResults([{ id: null, title: 'No movie found', genre: '' }]);
      } else {
        setResults(res.data);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setResults([{ id: null, title: 'Error fetching data', genre: '' }]);
    }
  };

  const handleMovieClick = (id) => {
    if (id) {
      navigate(`/movies/${id}`);
    }
  };

  return (
    <div className="container">
      <input
        type="text"
        className="search-input"
        placeholder="Search by title or genre..."
        value={query}
        onChange={handleSearch}
      />

      {/* Render only if there are results */}
      {results.length > 0 && (
        <div className="results-container">
          {results.map((movie, index) => (
            <div
              key={index}
              onClick={() => handleMovieClick(movie.id)}
              style={{ cursor: movie.id ? 'pointer' : 'default' }}
            >
              <strong>{movie.title}</strong>
              {movie.genre && <span className="genre"> ({movie.genre})</span>}
            </div>
          ))}
  
        </div>
      )}
    
    </div>
  );
}

export default Search;