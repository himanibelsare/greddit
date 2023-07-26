import mongoose from "mongoose";

const CommentsSchema = new mongoose.Schema({
  comment: String,
  Post: String,
  User: String,
});

const Comment = mongoose.model("comments", CommentsSchema);

export default Comment;
