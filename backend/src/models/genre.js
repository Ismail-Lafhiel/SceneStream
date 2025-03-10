const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ["movie", "tv"],
      default: "movie"
    }
  },
  {
    timestamps: true
  }
);

// Create a compound index for id and type to ensure uniqueness
genreSchema.index({ id: 1, type: 1 }, { unique: true });

const Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;