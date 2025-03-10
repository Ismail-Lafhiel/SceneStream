const mongoose = require("mongoose");

const tvShowSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    overview: { type: String, default: "" },
    backdrop_path: { type: String, default: "../assets/images/default-backdrop.jpg" },
    poster_path: { type: String, default: "../assets/images/default-poster.jpg" },
    first_air_date: { type: String, required: true },
    vote_average: { type: Number, default: 0 },
    vote_count: { type: Number, default: 0 },
    genre_ids: { type: [Number], default: [] },
  });

const TVShow = mongoose.model("TVShow", tvShowSchema);

module.exports = TVShow;
