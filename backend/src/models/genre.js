const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['movie', 'tv'],
    required: true
  }
}, { timestamps: true });

// Create a compound index on id and type to allow same id for different types
genreSchema.index({ id: 1, type: 1 }, { unique: true });

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;