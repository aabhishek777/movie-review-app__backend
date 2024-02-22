import { isValidObjectId } from "mongoose";
import Movie from "../schema/movie.js";
import Review from "../schema/review.js";
import cloudinary from "../services/cloudinaryService.js";

export const uploadTrailer = async (req, res) => {
  const { file } = req;
  const { movieId } = req.params;

  if (!file || !isValidObjectId(movieId)) {
    return res
      .status(400)
      .json({ msg: "File not found or not a valid object id" });
  }

  try {
    const { public_id, secure_url: url } = await cloudinary.uploader.upload(
      file.path,
      {
        resource_type: "video",
      }
    );

    const movie = await Movie.findById(movieId);

    if (!movie) return res.status(404).json({ msg: "Movie not found" });
    if (!movie.trailer) movie.trailer = {};

    movie.trailer.public_id = public_id;
    movie.trailer.url = url;

    await movie.save();

    res.status(200).json({ msg: "Success", data: movie });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Error", data: error.message });
  }
};

export const createMovie = async (req, res) => {
  const { file } = req;

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;

  const newMovie = new Movie({
    title,
    storyLine,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    trailer,
    language,
  });

  if (director) {
    if (!isValidObjectId(director))
      return res.status(400).json({ msg: "invalid director id" });

    newMovie.director = director;
  }
  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return res.status(400).json({ msg: "invalid writer id" });
    }
    newMovie.writers = writers;
  }
  //uploading poster

  const {
    secure_url: url,
    public_id,
    responsive_breakpoints,
  } = await cloudinary.uploader.upload(file.path, {
    transformation: {
      width: 1280,
      height: 720,
    },
    responsive_breakpoints: {
      create_derived: true,
      max_width: 640,
      max_images: 3,
    },
  });

  const newPoster = { url, public_id, responsive: [] };
  if (responsive_breakpoints[0].length) {
    for (i of responsive_breakpoints[0]) {
      const { secure_url } = i;
      newPoster.responsive.push(secure_url);
    }
  }
  newMovie.poster = newPoster;

  await newMovie.save();

  // console.log(cloudRes?.responsive_breakpoints[0]?.breakpoints);
  res.status(201).json({
    msg: "success",
    data: {
      id: newMovie._id,
      title,
    },
  });
};

export const updateMovieWithoutPoster = async (req, res) => {
  const { movieId } = req.query;

  console.log(req);
  if (!isValidObjectId(movieId))
    return res.status(400).json({ msg: "not a valid object id" });

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;

  console.log(
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language
  );

  const movie = await Movie.findById(movieId);

  movie.title = title;
  movie.storyLine = storyLine;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.tags = tags;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  if (director) {
    if (!isValidObjectId(director))
      return res.status(400).json({ msg: "invalid director id" });

    movie.director = director;
  }
  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return res.status(400).json({ msg: "invalid writer id" });
    }
    movie.writers = writers;
  }

  await movie.save();

  // console.log(movie);

  res.status(200).json({ msg: "movie updated" });
};

export const searchMovie = async (req, res) => {
  const { title } = req.params;

  const { query } = req;
  console.log(query);
  console.log(title);
  try {
    const result = await Movie.find({ title: { $regex: "i" } });

    res.status(200).json({ msg: "success", data: result });
  } catch (error) {
    res.status(400).json({ msg: "error", data: error });
  }
};

export const getLatestUploads = async (req, res) => {
  const { limit = 5 } = req.query;

  const result = await Movie.find({ status: "public" })
    .sort({ createtedAt: -1 })
    .limit(parseInt(limit));
  const movies = result.map((m) => ({
    title: m.titlle,
    id: m._id,
    poster: m.poster?.url,
    trailer: m.trailer?.url,
  }));
  res.status(200).json({ msg: "sucess", data: movies });
};

export const getAllMovies = async (req, res) => {
  try {
    const result = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json({ msg: "sucess", data: result });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "error", data: error });
  }
};

export const getSingleMOvie = async (req, res) => {
  const { movieId } = req.params;
  if (!isValidObjectId(movieId))
    return res.status(400).json({ msg: "Not a valid object id" });
  try {
    const result = await Movie.findOne({ _id: movieId }).populate(
      "director writers cast.actor"
    );
    const {
      id: _id,
      title,
      storyLine,
      cast,
      writers,
      director,
      releaseDate,
      genres,
      tags,
      language,
      poster,
      trailer,
      type,
    } = result;

    //////////////////////////////////WORKING HERE TO extract AVG_RATING///////////////////////////////

    //here we are first find the Review document as avgRat in rating filed and then perform isMatch and then perform avrage ratingin the docunment
    const avgRat = await Review.aggregate([
      {
        $match: { parentMovie: result._id },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          avgRating: {
            $avg: "$rating",
          },
        },
      },
    ]);
    console.log(avgRat.length);
    if (avgRat.length === 0) {
      return res.status(200).json({
        msg: "success",
        data: {
          avgRating: "Rating is not available",
          id: _id,
          title,
          storyLine,
          cast,
          writers,
          director,
          releaseDate,
          genres,
          tags,
          language,
          poster,
          trailer,
          type,
        },
      });
    }

    return res.status(200).json({
      msg: "sucess",
      data: {
        avgRating: avgRat,
        id: _id,
        title,
        storyLine,
        cast,
        writers,
        director,
        releaseDate,
        genres,
        tags,
        language,
        poster,
        trailer,
        type,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ msg: "error", data: error });
  }
};

export const getMoviesByTags = async (req, res) => {
  const { movieId } = req.params;
  if (!isValidObjectId(movieId))
    return res.status(400).json({ msg: "not a valid object Id" });

  try {
    const movie = await Movie.findOne({ _id: movieId });

    let commonMovies = await Movie.aggregate([
      {
        $match: {
          tags: { $in: [...movie.tags] },
          _id: { $ne: movie._id },
        },
      },
      {
        $limit: 6,
      },
      {
        $project: {
          title: 1,
          poster: "$poster.url",
        },
      },
    ]);

    for (const m of commonMovies) {
      const resu = await Review.aggregate([
        {
          $match: { parentMovie: m._id },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            avgRating: {
              $avg: "$rating",
            },
          },
        },
      ]);

      if (resu[0]) {
        m.avgRating = resu[0].avgRating;
      } else {
        m.avgRating = 0; // Set a default value here if needed
      }
    }

    return res.status(200).json({ msg: "success", data: commonMovies });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "not a valid object Id" });
  }
};

export const getTopRatedMovies = async (req, res) => {
  const { type = "film" } = req.query;

  try {
    const movies = await Movie.aggregate([
      {
        $match: {
          reviews: { $exists: true },
          status: { $eq: "public" },
          // type: { $eq: type }, //blocked filtering by type for now due to unavailbilty of real data
        },
      },
      {
        $project: {
          title: 1,
          poster: "$poster.url",
          reviewCount: { $size: "$reviews" },
          type: "$type",
        },
      },
      {
        $sort: {
          reviewCount: -1,
        },
      },
      {
        $limit: 6,
      },
    ]);

    const moviesWithRatings = [];

    for (const movie of movies) {
      const aggregateMovie = await Review.aggregate([
        {
          $match: { parentMovie: movie._id },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            avgRating: {
              $avg: "$rating",
            },
          },
        },
      ]);

      const avgRating = aggregateMovie[0]?.avgRating || 0;
      moviesWithRatings.push({ ...movie, avgRating });
    }

    // Sort movies based on avgRating
    const sortedMovies = moviesWithRatings.sort(
      (a, b) => b.avgRating - a.avgRating
    );

    res.status(200).json({ msg: "success", data: sortedMovies });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "error", data: error.message });
  }
};
