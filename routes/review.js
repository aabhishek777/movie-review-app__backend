import { Router } from "express";
import { isAuth } from "../middlewares/user.js";
import {
  addReview,
  getReviewByMovie,
  updateReview,
} from "../controllers/review.js";

const router = Router();

router.post("/add-review/:movieId", isAuth, addReview);
router.patch("/update/:reviewId", isAuth, updateReview);

router.get("/all-reviews/:movieId", getReviewByMovie);
export default router;
