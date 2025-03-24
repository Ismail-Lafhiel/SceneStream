import mongoose, { Schema, Document } from "mongoose";
import { IMovieBookmark } from "../interfaces";

const movieBookmarkSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    movieId: { type: Number, required: true },
    title: { type: String, required: true },
    poster_path: String,
    backdrop_path: String,
    vote_average: Number,
    runtime: Number,
    release_date: String,
    overview: String,
  },
  { timestamps: true }
);

movieBookmarkSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model<IMovieBookmark>(
  "MovieBookmark",
  movieBookmarkSchema
);
