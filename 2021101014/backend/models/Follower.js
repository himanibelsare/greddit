import mongoose from "mongoose";

const FollowerSchema = new mongoose.Schema({
  myUsername: String,
  myFollower: String,
});


const Follower = mongoose.model("followers", FollowerSchema);

export default Follower;
