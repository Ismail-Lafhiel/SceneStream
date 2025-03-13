const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      trim: true,
    },
    backdrop_path: String,
    poster_path: String,
    release_date: String,
    vote_average: Number,
    vote_count: Number,
    genre_ids: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for calculating rating as a percentage
movieSchema.virtual("rating_percentage").get(function () {
  return this.vote_average * 10;
});

// Virtual field for year
movieSchema.virtual("release_year").get(function () {
  return this.release_date ? this.release_date.substring(0, 4) : null;
});

// Index for faster searches
movieSchema.index({ title: "text", overview: "text" });
movieSchema.index({ genre_ids: 1 });
movieSchema.index({ vote_average: -1 });
movieSchema.index({ release_date: -1 });

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
