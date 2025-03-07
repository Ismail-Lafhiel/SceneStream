const mongoose = require("mongoose");

const movieBookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    poster_path: String,
    backdrop_path: String,
    vote_average: Number,
    runtime: Number,
    release_date: String,
    overview: String,
  },
  { timestamps: true }
);

// Compound index to ensure a user can't bookmark the same movie twice
movieBookmarkSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const MovieBookmark = mongoose.model("MovieBookmark", movieBookmarkSchema);

module.exports = MovieBookmark;
