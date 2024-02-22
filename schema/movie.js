import mongoose from "mongoose";
import movieGenres from "../helpers/movieGenres.js";

const movieSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    storyLine: {
      type: String,
      trim: true,
      required: true,
    },
    director: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actor",
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["private", "public"],
      default: "public",
    },
    genres: {
      type: [String],
      required: true,
      enum: movieGenres,
    },
    tags: {
      type: [String],
      required: true,
    },
    cast: [
      {
        actor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Actor",
        },
        roleAs: String,
        leadActor: Boolean,
      },
    ],
    writers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actor" }],
    poster: {
      type: Object,
      public_id: { type: String, required: true },
      url: { type: String, required: true },
      responsive: [URL],
      required: true,
    },
    trailer: {
      type: Object,
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    type: {
      type: String,
      default: "Film",
    },

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    language: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
