import express from "express";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import userRouter from "./routes/users.js";
import postRouter from "./routes/posts.js";
import profileRouter from "./routes/profile.js";
import followerRouter from "./routes/followers.js";
import mySubgredditRouter from "./routes/mysubgreddit.js";
import allSubgredditRouter from "./routes/allsubgreddits.js";
import savedposts from "./routes/savedposts.js";
import comments from "./routes/comments.js";
import reports from "./routes/reports.js";

//middleware layer runs before checking any routes

const app = express();
app.use(cors());

connectDB();

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/profile", profileRouter);
app.use("/api/followers", followerRouter);
app.use("/api/mysubgreddits", mySubgredditRouter);
app.use("/api/allsubgreddits", allSubgredditRouter);
app.use("/api/savedposts", savedposts);
app.use("/api/comments", comments);
app.use("/api/reports", reports);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
