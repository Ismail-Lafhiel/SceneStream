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
    original_title: {
      type: String,
      trim: true,
    },
    overview: {
      type: String,
      trim: true,
    },
    poster_path: String,
    backdrop_path: String,
    genre_ids: [Number],
    genres: [
      {
        id: Number,
        name: String,
      },
    ],
    release_date: String,
    popularity: Number,
    vote_average: Number,
    vote_count: Number,
    adult: Boolean,
    original_language: String,
    video: Boolean,
    credits: {
      cast: [
        {
          id: Number,
          name: String,
          character: String,
          profile_path: String,
          order: Number,
        },
      ],
      crew: [
        {
          id: Number,
          name: String,
          job: String,
          department: String,
          profile_path: String,
        },
      ],
    },
    videos: {
      results: [
        {
          id: String,
          key: String,
          name: String,
          site: String,
          type: String,
        },
      ],
    },
    runtime: Number,
    budget: Number,
    revenue: Number,
    status: String,
    tagline: String,
    production_companies: [
      {
        id: Number,
        name: String,
        logo_path: String,
        origin_country: String,
      },
    ],
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
movieSchema.index({ popularity: -1 });
movieSchema.index({ vote_average: -1 });
movieSchema.index({ release_date: -1 });

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
