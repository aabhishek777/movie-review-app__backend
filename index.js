import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { getConnection } from "./config/db.js";

import userRouter from "./routes/user.js";
import actorRouter from "./routes/actor.js";
import movieRouter from "./routes/movie.js";
import reviewRouter from "./routes/review.js";

const app = express();
config({ path: "./config/.env" });
const port = process.env.PORT || 10000;
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
getConnection();

app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/movie", movieRouter);
app.use("/api/review", reviewRouter);

app.listen(port, () => console.log(`app is running on ${port} port`));
