const mongoose = require("mongoose");

const tvShowSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
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
    first_air_date: String,
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
tvShowSchema.virtual("rating_percentage").get(function () {
  return this.vote_average * 10;
});

// Virtual field for year
tvShowSchema.virtual("first_air_year").get(function () {
  return this.first_air_date ? this.first_air_date.substring(0, 4) : null;
});

// Index for faster searches
tvShowSchema.index({ name: "text", overview: "text" });
tvShowSchema.index({ genre_ids: 1 });
tvShowSchema.index({ vote_average: -1 });
tvShowSchema.index({ first_air_date: -1 });

const TVShow = mongoose.model("TVShow", tvShowSchema);

module.exports = TVShow;
