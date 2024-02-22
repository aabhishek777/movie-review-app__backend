import { Router } from "express";
import {
  createActor,
  deleteActor,
  getLatestActors,
  getSingleActor,
  latestUploads,
  searchActor,
  updateActor,
} from "../controllers/actor.js";
import { uploadImage } from "../middlewares/multer.js";
import { isAdmin, isAuth } from "../middlewares/user.js";


const router = Router();

router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  createActor
);
router.post(
  "/update/:actorId",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  updateActor
);
router.delete("/:actorId", isAuth, isAdmin, deleteActor);
router.post("/search/", searchActor);
router.get("/latest-upload", latestUploads);
router.get("/single/:id", getSingleActor);
router.get('/actors', isAuth, isAdmin,getLatestActors )





export default router;
