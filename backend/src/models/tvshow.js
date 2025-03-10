// models/TVShow.js
const mongoose = require('mongoose');

const tvShowSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  overview: { type: String, required: true },
  backdrop_path: { type: String, required: true },
  poster_path: { type: String, required: true },
  first_air_date: { type: String, required: true },
  vote_average: { type: Number, required: true },
  vote_count: { type: Number, required: true },
  genre_ids: { type: [Number], required: true },
});

const TVShow = mongoose.model('TVShow', tvShowSchema);

module.exports = TVShow;