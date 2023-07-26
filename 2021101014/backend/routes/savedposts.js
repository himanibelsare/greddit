import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Post from "../models/Posts.js";
const router = express.Router();

//api/savedposts/get

//getting saved posts
router.get("/get", auth, async (req, res) => {
  try {
    console.log("here");
    const posts = [];
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (user) {
      const username = user.username;
      console.log(username);
      const savedArray = user.savedPosts;
      //   console.log(savedArray);

      for (const arrayItem of savedArray) {
        // console.log(arrayItem);
        try {
          const post = await Post.findOne({ Title: arrayItem });
          if (post) {
            posts.push(post);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
    // console.log("outside", posts);
    return res.send(posts);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

// removing saved posts
router.put("/unsavepost", auth, async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;
    const name = await User.findById(userId);
    console.log(title, name.username);
    const user = name.username;
    const currPost = await Post.findOne({
      Title: title,
    });
    const currUser = await User.findOne({
      username: user,
    });
    if (currPost && currUser) {
      const savedArray = currUser.savedPosts;
      // console.log(savedArray);
      const saves = savedArray.includes(title);
      // console.log(saves);
      if (!saves) {
        console.log("not saved!");
        return res.status(400).send({ errors: [{ msg: "not saved!" }] });
      }
      // remove from savedArray
      const index = savedArray.indexOf(title);
      if (index > -1) {
        savedArray.splice(index, 1); // 2nd parameter means remove one item only
      }
      console.log(savedArray);
      currUser.savedPosts = savedArray;
      await currUser.save();
      console.log(currUser);
      res.send(savedArray);
      // return res.send("done");
    } else {
      return res.send("no such post!");
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

export default router;
