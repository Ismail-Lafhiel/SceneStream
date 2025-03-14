import mongoose, { Schema, Document } from "mongoose";
import { IMovie } from "../interfaces/movie.interface";

const MovieSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  overview: { type: String, required: true },
  backdrop_path: { type: String },
  poster_path: { type: String },
  release_date: { type: String },
  vote_average: { type: Number },
  vote_count: { type: Number },
  genre_ids: { type: [Number] },
  runtime: { type: Number },
  status: { type: String },
  tagline: { type: String },
  credits: {
    cast: [
      {
        id: { type: Number },
        name: { type: String },
        character: { type: String },
        profile_path: { type: String },
      },
    ],
    crew: [
      {
        id: { type: Number },
        name: { type: String },
        job: { type: String },
        profile_path: { type: String },
      },
    ],
  },
  videos: {
    results: [
      {
        id: { type: String },
        key: { type: String },
        name: { type: String },
        site: { type: String },
        size: { type: Number },
        type: { type: String },
      },
    ],
  },
});

export default mongoose.model<IMovie & Document>("Movie", MovieSchema);
