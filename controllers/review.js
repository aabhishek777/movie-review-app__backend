import { isValidObjectId } from "mongoose";
import Movie from "../schema/movie.js";
import Review from "../schema/review.js";

export const addReview = async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  const { content, rating } = req.body;

  if (!isValidObjectId(movieId))
    return res.status(400).json({ msg: "Not a valid ObjectId" });

  //find movie->//check weather already reviewed or not // update in  movie because we have refernence of that // save reviews and movies;
  try {
    const movie = await Movie.findOne({ _id: movieId });

    if (!movie) return res.status(400).json({ msg: "No movie found" });

    //checking if already exist or not
    // console.log("userID", userId);
    const alreadyReviewed = await Review.findOne({
      owner: userId,
      parentMovie: movie._id,
    });

    if (alreadyReviewed)
      return res.status(400).json({ msg: "Already reviewed" });

    //creating review

    const newReview = new Review({
      owner: userId,
      parentMovie: movie._id,
      content,
      rating,
    });
    //updating movie

    movie.reviews.push(newReview);

    await movie.save();
    await newReview.save();

    res.status(200).json({ msg: "sucess", data: newReview });
  } catch (error) {
    res.status(400).json({ msg: "error", data: error });
  }
};

export const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;

  if (!isValidObjectId(reviewId))
    return res.status(200).json({ msg: "Not a valid object id" });
  try {
    const review = await Review.findOne({ _id: reviewId });
    if (!review) return res.status(200).json({ msg: "No review Found" });

    if (content) review.content = content;
    if (rating) review.rating = rating;

    const result = await review.save();

    return res.status(200).json({ msg: "sucess", data: result });
  } catch (error) {
    console.log(error);
  }
};

export const getReviewByMovie = async (req, res) => {
  const { movieId } = req.params;
  if (!isValidObjectId(movieId))
    return res.status(200).json({ msg: "Not a valid object id" });

  try {
    const movie = await Movie.findOne({ _id: movieId })
      .populate({
        path: "reviews",
        populate: {
          path: "owner",
          select: "name",
        },
      })
      .select("reviews");

    //********THIS WILL BE THE FORMAT********  */
    /*     *********************WE USED movie>review>owner  by SING THREE POPULATE OPRATIONS****************/
    //       {
    //     "msg": "sucess",
    //     "data": {
    //         "_id": "64e530073ad53a6229585889",
    //         "reviews": [
    //             {
    //                 "_id": "6571697d64ea26fcb2a914d7",
    //                 "owner": {
    //                     "_id": "6565d69f9d8910f423143f32",
    //                     "name": "Abhishek Singh"
    //                 },
    //                 "parentMovie": "64e530073ad53a6229585889",
    //                 "content": "Must Watch movie",
    //                 "rating": 4,
    //                 "__v": 0
    //             },
    //             {
    //                 "_id": "657180e6ef548d0f32cd5527",
    //                 "owner": {
    //                     "_id": "6565d6f39d8910f423143f35",
    //                     "name": "Abhishek Singh"
    //                 },
    //                 "parentMovie": "64e530073ad53a6229585889",
    //                 "content": "very good movie 2",
    //                 "rating": 4,
    //                 "__v": 0
    //             }
    //         ]
    //     }
    // }

    if (!movie) return res.status(200).json({ msg: "movie not found" });
    return res.status(200).json({ msg: "sucess", data: movie });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "error", data: error });
  }
};
