import React, { useState } from 'react';
// import './MovieDetails.css';

function Ratings({ initialRating = 0, onRatingChange, disabled = false }) {
  const [localRating, setLocalRating] = useState(initialRating);

  const handleRating = (newRating) => {
    if (disabled) return; // Prevent changes if disabled

    setLocalRating(newRating);
    if (onRatingChange) onRatingChange(newRating);
  };

  const renderStars = () =>
    [...Array(5)].map((_, i) => (
      <span
        key={i}
        onClick={() => handleRating(i + 1)}
        className="star"
        style={{ color: i < localRating ? '#FFD700' : '#CCC', cursor: disabled ? 'default' : 'pointer' }}
        role={disabled ? 'presentation' : 'button'}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => !disabled && (e.key === 'Enter' || e.key === ' ') && handleRating(i + 1)}
        aria-label={disabled ? `Rated ${localRating} stars` : `Rate ${i + 1} star`}
      >
        ★
      </span>
    ));

  return (
    <p><strong>Rating:</strong> {renderStars()}</p>
  );
}

export default Ratings;