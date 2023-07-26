import express from "express";
import auth from "../middleware/auth.js";
import SubGreddit from "../models/SubGreddit.js";
import User from "../models/User.js";
import Post from "../models/Posts.js";

const router = express.Router();

///api/posts

// create posts
router.post("/createposts", auth, async (req, res) => {
  try {
    const { makePost } = req.body;
    const userId = req.user.id;
    const name = await User.findById(userId);
    const user = name.username;
    // console.log(makePost.Title, makePost.Description, makePost.subName, user);
    let post = await Post.findOne({ Title: makePost.Title });
    if (post) {
      console.log("already exists");
      return res.status(400).send({ errors: [{ msg: "Post already exists" }] });
    }
    post = new Post({
      Title: makePost.Title,
      Description: makePost.Description,
      subName: makePost.subName,
      User: user,
    });
    await post.save();
    res.send(post);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

// get posts
router.post("/getposts", auth, async (req, res) => {
  try {
    // console.log("in get posts");
    const { subName } = req.body;
    const posts = await Post.find({
      subName: subName,
    });
    // console.log(posts);
    res.send(posts);
    // return res.send("done");
  } catch (err) {
    console.error("Error:", err);
    res.send(err);
  }
});

// upvoting a post
router.put("/upvote", auth, async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;
    const name = await User.findById(userId);
    // console.log(title, name.username);
    const user = name.username;
    const currPost = await Post.findOne({
      Title: title,
    });
    if (currPost) {
      const upvotes = currPost.Upvotes;
    //   console.log("upvotes", upvotes);
      const usernamesUpvotes = upvotes.includes(user);
    //   console.log(usernamesUpvotes);
      if (usernamesUpvotes) {
        const index = upvotes.indexOf(user);
        if (index > -1) {
          upvotes.splice(index, 1); // 2nd parameter means remove one item only
        }
        // console.log(upvotes);
        currPost.Upvotes = upvotes;
        await currPost.save();
        // console.log("already upvoted!");
        // return res.status(400).send({ errors: [{ msg: "already upvoted!" }] });
        return res.send(currPost);
      }
      const downvotes = currPost.Downvotes;
      const usernamesDownvotes = downvotes.includes(user);
      if (usernamesDownvotes) {
        const index = downvotes.indexOf(user);
        if (index > -1) {
          downvotes.splice(index, 1); // 2nd parameter means remove one item only
        }
        // console.log(downvotes);
      }
      upvotes.push(user);
    //   console.log(upvotes);
    //   console.log(downvotes);
      currPost.Upvotes = upvotes;
      currPost.Downvotes = downvotes;
      await currPost.save();
    //   console.log(currPost);
      res.send(currPost);
      // return res.send("done");
    } else {
      return res.send("no such post!");
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

// downvoting a post
router.put("/downvote", auth, async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;
    const name = await User.findById(userId);
    // console.log(title, name.username);
    const user = name.username;
    const currPost = await Post.findOne({
      Title: title,
    });
    if (currPost) {
      const downvotes = currPost.Downvotes;
    //   console.log("downvotes", downvotes);
      const usernamesDownvotes = downvotes.includes(user);
    //   console.log(usernamesDownvotes);
      if (usernamesDownvotes) {
        const index = downvotes.indexOf(user);
        if (index > -1) {
          downvotes.splice(index, 1); // 2nd parameter means remove one item only
        }
        // console.log(downvotes);
        currPost.Downvotes = downvotes;
        await currPost.save();
        console.log("already downvoted!");
        // return res.status(400).send({ errors: [{ msg: "already upvoted!" }] });
        return res.send(currPost);
      }
      const upvotes = currPost.Upvotes;
      const usernamesUpvotes = upvotes.includes(user);
      if (usernamesUpvotes) {
        const index = upvotes.indexOf(user);
        if (index > -1) {
          upvotes.splice(index, 1); // 2nd parameter means remove one item only
        }
        // console.log(upvotes);
      }
      downvotes.push(user);
    //   console.log(upvotes);
    //   console.log(downvotes);
      currPost.Upvotes = upvotes;
      currPost.Downvotes = downvotes;
      await currPost.save();
    //   console.log(currPost);
      res.send(currPost);
      // return res.send("done");
    } else {
      return res.send("no such post!");
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

router.post("/:subName/:postId", (req, res) => {
  console.log("req", req.params, req.body);
  res.send("done"); //sending js but it goes as json
});

// saving a post
router.put("/savepost", auth, async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;
    const name = await User.findById(userId);
    // console.log(title, name.username);
    const user = name.username;
    const currPost = await Post.findOne({
      Title: title,
    });
    const currUser = await User.findOne({
      username: user,
    });
    if (currPost && currUser) {
      const savedArray = currUser.savedPosts;
    //   console.log(savedArray);
      const saves = savedArray.includes(title);
    //   console.log(saves);
      if (saves) {
        console.log("already saved!");
        return res.status(400).send({ errors: [{ msg: "already saved!" }] });
      }
      savedArray.push(title);
      currUser.savedPosts = savedArray;
      await currUser.save();
    //   console.log(currUser);
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
