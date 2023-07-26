import mongoose from "mongoose";

const SubGredditSchema = new mongoose.Schema({
  Name: String,
  Description: String,
  Tags: String,
  BannedWords: String,
  Users: Array,
  BlockedUsers: Array,
  Posts: Number,
  Owner: String,
  Requests: Array,
  LeftUsers: Array,
});

const SubGreddit = mongoose.model("SubGreddits", SubGredditSchema);

export default SubGreddit;
