// src/models/genre.js
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['movie', 'tv', 'both'],
    default: 'both'
  },
  isCustom: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Genre', genreSchema);