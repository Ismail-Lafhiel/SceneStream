// src/models/tvshow.js
const mongoose = require('mongoose');

const tvShowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    trim: true
  },
  tmdbId: {
    type: Number,
    sparse: true, 
    index: true
  },
  overview: {
    type: String,
    trim: true
  },
  posterPath: {
    type: String,
    default: '/src/assets/images/default-poster.jpg'
  },
  backdropPath: {
    type: String,
    default: '/src/assets/images/default-backdrop.jpg'
  },
  firstAirDate: {
    type: Date
  },
  lastAirDate: {
    type: Date
  },
  numberOfSeasons: {
    type: Number,
    default: 0
  },
  numberOfEpisodes: {
    type: Number,
    default: 0
  },
  episodeRunTime: [{
    type: Number
  }],
  voteAverage: {
    type: Number,
    default: 0
  },
  voteCount: {
    type: Number,
    default: 0
  },
  popularity: {
    type: Number,
    default: 0
  },
  genres: [{
    type: Number,
    ref: 'Genre'
  }],
  status: {
    type: String,
    enum: ['active', 'deleted', 'hidden'],
    default: 'active'
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for genre objects
tvShowSchema.virtual('genreObjects', {
  ref: 'Genre',
  localField: 'genres',
  foreignField: 'tmdbId'
});

// Instead of permanently deleting, mark as deleted
tvShowSchema.methods.softDelete = async function() {
  this.status = 'deleted';
  return this.save();
};

// Hide from regular queries but keep in database
tvShowSchema.methods.hide = async function() {
  this.status = 'hidden';
  return this.save();
};

// Only return active TV shows by default
tvShowSchema.pre('find', function() {
  if (!this._conditions.status) {
    this._conditions.status = { $ne: 'deleted' };
  }
});

tvShowSchema.pre('findOne', function() {
  if (!this._conditions.status) {
    this._conditions.status = { $ne: 'deleted' };
  }
});

module.exports = mongoose.model('TvShow', tvShowSchema);