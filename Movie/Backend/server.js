const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- MySQL Connection (Promise-based) ---
let db;
const initializeDatabase = async () => {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root', // or your MySQL password
      database: 'moviesCollection', // use your target database name
    });
    console.log('Connected to MySQL database.');
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  }
};
initializeDatabase();

/* ------------------- ROUTES ------------------- */

// ✅ Add a movie
app.post('/movies', async (req, res) => {
  const { title, genre, release_year, notes, language, rating } = req.body;
  const sql = 'INSERT INTO movies (title, genre, release_year, notes, language, rating) VALUES (?, ?, ?, ?, ?, ?)';
  try {
    const [result] = await db.execute(sql, [title, genre, release_year, notes, language, rating]);
    res.status(201).json({ message: 'Movie added successfully', movieId: result.insertId });
  } catch (err) {
    console.error('Error inserting movie:', err);
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

// ✅ Get filter options (genre, language, year)
app.get('/api/movies/filters', async (req, res) => {
  try {
    const [genres] = await db.query('SELECT DISTINCT genre FROM movies');
    const [languages] = await db.query('SELECT DISTINCT language FROM movies');
    const [years] = await db.query('SELECT DISTINCT release_year FROM movies');

    res.json({
      genres: genres.map(row => row.genre),
      languages: languages.map(row => row.language),
      years: years.map(row => row.release_year),
    });
  } catch (err) {
    console.error('Error fetching filters:', err);
    res.status(500).send('Filter fetch error');
  }
});

// ✅ Get movies (search + filters + sort)
app.get('/api/movies', async (req, res) => {
  const { genre, language, year, sort, q } = req.query;
  let query = 'SELECT * FROM movies WHERE 1=1';
  const params = [];

  if (q) {
    query += ' AND (LOWER(title) LIKE ? OR LOWER(genre) LIKE ?)';
    const searchTerm = `${q.toLowerCase()}%`;
    params.push(searchTerm, searchTerm);
  }

  if (genre) {
    query += ' AND genre = ?';
    params.push(genre);
  }

  if (language) {
    query += ' AND language = ?';
    params.push(language);
  }

  if (year) {
    query += ' AND release_year = ?';
    params.push(year);
  }

  if (sort === 'titleAsc') {
    query += ' ORDER BY title ASC';
  } else if (sort === 'titleDesc') {
    query += ' ORDER BY title DESC';
  }

  try {
    const [results] = await db.query(query, params);
    res.json(results);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// ✅ Search movies (used for type-ahead search)
app.get('/movies', async (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) return res.status(400).json({ message: 'Missing query parameter' });

  try {
    const [rows] = await db.query(
      'SELECT id, title, genre FROM movies WHERE LOWER(title) LIKE ? OR LOWER(genre) LIKE ? LIMIT 10',
      [`${searchQuery.toLowerCase()}%`, `${searchQuery.toLowerCase()}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).send('Server error');
  }
});

// ✅ Get movie by ID
app.get('/movies/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Movie not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching movie by ID:', err);
    res.status(500).send('Server error');
  }
});

// ✅ Update movie
app.put('/movie/:id', async (req, res) => {
  const movieId = req.params.id;
  const { title, genre, release_year, rating, notes, language } = req.body;
  const sql = 'UPDATE movies SET title=?, genre=?, release_year=?, rating=?, notes=?, language=? WHERE id=?';

  try {
    const [result] = await db.query(sql, [title, genre, release_year, rating, notes, language, movieId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie updated successfully' });
  } catch (err) {
    console.error('Error updating movie:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ Update only rating
app.put('/movies/:id/rating', async (req, res) => {
  const { rating } = req.body;
  try {
    await db.query('UPDATE movies SET rating = ? WHERE id = ?', [rating, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating rating:', err);
    res.status(500).send('Server error');
  }
});

// ✅ Delete movie
app.delete('/movie/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM movies WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error('Error deleting movie:', err);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

/* ------------------- START SERVER ------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
