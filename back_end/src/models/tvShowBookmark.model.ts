import mongoose, { Schema, Document } from "mongoose";
import { ITvShowBookmark } from "../interfaces";

const tvShowBookmarkSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    tvShowId: { type: Number, required: true },
    name: { type: String, required: true },
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

tvShowBookmarkSchema.index({ userId: 1, tvShowId: 1 }, { unique: true });

export default mongoose.model<ITvShowBookmark>(
  "TvShowBookmark",
  tvShowBookmarkSchema
);
