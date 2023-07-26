import mongoose from "mongoose";

const PostsSchema = new mongoose.Schema({
  Title: String,
  Description: String,
  subName: String,
  User: String,
  Upvotes: Array,
  Downvotes: Array,
  Comments: Array,
});

const Post = mongoose.model("posts", PostsSchema);

export default Post;
