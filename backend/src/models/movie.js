const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  overview: { type: String, required: true },
  backdrop_path: { type: String, required: true },
  poster_path: { type: String, required: true },
  release_date: { type: String, required: true },
  vote_average: { type: Number, required: true },
  vote_count: { type: Number, required: true },
  genre_ids: { type: [Number], required: true },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;