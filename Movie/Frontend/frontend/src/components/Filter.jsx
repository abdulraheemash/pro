import React from 'react';

function Filter({
  filters,
  selectedGenre, setSelectedGenre,
  selectedLanguage, setSelectedLanguage,
  selectedYear, setSelectedYear
}) {
  return (
    <nav style={{ display: 'flex', gap: '1rem' }}>
      {/* Genre Filter */}
      <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
        <option value="">All Genres</option>
        {filters.genres.map((g, i) => (
          <option key={i} value={g}>{g}</option>
        ))}
      </select>

      {/* Language Filter */}
      <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}>
        <option value="">All Languages</option>
        {filters.languages.map((l, i) => (
          <option key={i} value={l}>{l}</option>
        ))}
      </select>

      {/* Year Filter */}
      <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
        <option value="">All Years</option>
        {filters.years.map((y, i) => (
          <option key={i} value={y}>{y}</option>
        ))}
      </select>
    </nav>
  );
}

export default Filter;