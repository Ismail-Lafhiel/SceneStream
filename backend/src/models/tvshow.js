const mongoose = require("mongoose");

const tvShowSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    original_name: {
      type: String,
      trim: true
    },
    overview: {
      type: String,
      trim: true
    },
    poster_path: String,
    backdrop_path: String,
    genre_ids: [Number],
    genres: [
      {
        id: Number,
        name: String
      }
    ],
    first_air_date: String,
    popularity: Number,
    vote_average: Number,
    vote_count: Number,
    original_language: String,
    origin_country: [String],
    credits: {
      cast: [
        {
          id: Number,
          name: String,
          character: String,
          profile_path: String,
          order: Number
        }
      ],
      crew: [
        {
          id: Number,
          name: String,
          job: String,
          department: String,
          profile_path: String
        }
      ]
    },
    videos: {
      results: [
        {
          id: String,
          key: String,
          name: String,
          site: String,
          type: String
        }
      ]
    },
    number_of_episodes: Number,
    number_of_seasons: Number,
    episode_run_time: [Number],
    status: String,
    type: String,
    networks: [
      {
        id: Number,
        name: String,
        logo_path: String,
        origin_country: String
      }
    ],
    seasons: [
      {
        id: Number,
        name: String,
        overview: String,
        poster_path: String,
        season_number: Number,
        episode_count: Number,
        air_date: String
      }
    ],
    last_air_date: String,
    in_production: Boolean,
    tagline: String,
    created_by: [
      {
        id: Number,
        name: String,
        profile_path: String
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for calculating rating as a percentage
tvShowSchema.virtual('rating_percentage').get(function() {
  return this.vote_average * 10;
});

// Virtual field for year
tvShowSchema.virtual('first_air_year').get(function() {
  return this.first_air_date ? this.first_air_date.substring(0, 4) : null;
});

// Index for faster searches
tvShowSchema.index({ name: 'text', overview: 'text' });
tvShowSchema.index({ genre_ids: 1 });
tvShowSchema.index({ popularity: -1 });
tvShowSchema.index({ vote_average: -1 });
tvShowSchema.index({ first_air_date: -1 });

const TVShow = mongoose.model("TVShow", tvShowSchema);

module.exports = TVShow;