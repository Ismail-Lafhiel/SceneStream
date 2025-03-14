import mongoose, { Schema, Document } from "mongoose";
import { IGenre } from "../interfaces/genre.interface";

const GenreSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
});

export default mongoose.model<IGenre & Document>("Genre", GenreSchema);
