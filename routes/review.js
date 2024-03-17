import { Router } from "express";
import { isAuth } from "../middlewares/user.js";
import {
  addReview,
  getReviewByMovie,
  updateReview,
} from "../controllers/review.js";

const router = Router();


//admin
router.post("/add-review/:movieId", isAuth, addReview);

router.patch("/update/:reviewId", isAuth, updateReview);


//public
router.get("/all-reviews/:movieId", getReviewByMovie);
// router.post('/public/add-review/:movieId',addReview);
export default router;
