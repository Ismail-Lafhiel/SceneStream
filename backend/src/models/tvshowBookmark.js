const mongoose = require("mongoose");

const tvShowBookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    tvShowId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    poster_path: String,
    backdrop_path: String,
    vote_average: Number,
    first_air_date: String,
    number_of_seasons: Number,
    number_of_episodes: Number,
    overview: String,
  },
  { timestamps: true }
);

// Compound index to ensure a user can't bookmark the same TV show twice
tvShowBookmarkSchema.index({ userId: 1, tvShowId: 1 }, { unique: true });

const TvShowBookmark = mongoose.model("TvShowBookmark", tvShowBookmarkSchema);

module.exports = TvShowBookmark;
