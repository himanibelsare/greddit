import express from "express";
import auth from "../middleware/auth.js";
import SubGreddit from "../models/SubGreddit.js";
import User from "../models/User.js";
const router = express.Router();

//"/api/mysubgreddits"

// get deets of subgreddits
router.get("/getdetails", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const name = await User.findById(userId);
    const subgreddits = await SubGreddit.find({ Owner: name.username });
    // console.log(subgreddits);
    res.send(subgreddits);
  } catch (err) {
    console.error("Error:", err);
    res.send(err);
  }
});

// get users
router.post("/getusers", auth, async (req, res) => {
  try {
    console.log("in get users");
    const { subName } = req.body;
    const userId = req.user.id;
    const name = await User.findById(userId);
    // console.log(name.username);
    const subgreddits = await SubGreddit.findOne({
      Owner: name.username,
      Name: subName,
    });
    console.log(subgreddits);
    res.send(subgreddits);
    // return res.send("done");
  } catch (err) {
    console.error("Error:", err);
    res.send(err);
  }
});

// get requests
router.post("/getrequests", auth, async (req, res) => {
  try {
    console.log("in get requests");
    const { subName } = req.body;
    const userId = req.user.id;
    const name = await User.findById(userId);
    // console.log(name.username);
    const user = name.username;
    const subgreddits = await SubGreddit.findOne({
      Owner: user,
      Name: subName,
    });
    console.log(subgreddits);
    res.send(subgreddits);
    // return res.send("done");
  } catch (err) {
    console.error("Error:", err);
    res.send(err);
  }
});

// create subgreddits
router.post("/createsubgreddit", auth, async (req, res) => {
  try {
    const { Name, Description, Tags, BannedWords } = req.body;
    const userId = req.user.id;
    const name = await User.findById(userId);
    const Users = [name.username];
    const Owner = name.username;
    const Posts = 0;
    const Requests = [];
    const LeftUsers = [];
    console.log(Name, Description, Tags, BannedWords, Users, Posts, Owner);
    let subgreddit = await SubGreddit.findOne({ Name });
    if (subgreddit) {
      console.log("already exists");
      return res
        .status(400)
        .send({ errors: [{ msg: "Subgreddit already exists" }] });
    }
    subgreddit = new SubGreddit({
      Name,
      Description,
      Tags,
      BannedWords,
      Users,
      Posts,
      Owner,
      Requests,
      LeftUsers,
    });
    await subgreddit.save();
    res.send(subgreddit);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

// creating requests - send requests
router.put("/requesttojoin", auth, async (req, res) => {
  try {
    const { subName } = req.body;
    const userId = req.user.id;
    const name = await User.findById(userId);
    //   console.log(name.username);
    const user = name.username;
    const subgreddit = await SubGreddit.findOne({
      Name: subName,
    });
    if (subgreddit) {
      const requestArray = subgreddit.Requests;
      // console.log(requestArray);
      const usernames = requestArray.includes(user);
      console.log(usernames);
      if (usernames) {
        console.log("already requested!");
        return res
          .status(400)
          .send({ errors: [{ msg: "already requested!" }] });
      }

      const users = subgreddit.Users;
      const joined = users.includes(user);
      if (joined) {
        console.log("already joined!!");
        return res.status(400).send({ errors: [{ msg: "already joined!" }] });
      }
      const leftUsers = subgreddit.LeftUsers;
      const left = leftUsers.includes(user);
      if (left) {
        console.log("already joined!!");
        return res.status(402).send({ errors: [{ msg: "already joined!" }] });
      }
      requestArray.push(user);
      subgreddit.Requests = requestArray;
      await subgreddit.save();
      console.log(subgreddit);
      console.log(requestArray);
      res.send(requestArray);
      // return res.send("done");
    } else {
      return res.send("no such subgreddit!");
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

//accepting requests
router.put("/acceptrequests", auth, async (req, res) => {
  try {
    const { subName, user } = req.body;
    // console.log(subName, user);
    const userId = req.user.id;
    const name = await User.findById(userId);
    console.log(name.username);
    const subgreddit = await SubGreddit.findOne({
      Owner: name.username,
      Name: subName,
    });
    if (!subgreddit) {
      console.log("No subgreddit like that");
      return res.status(404).send("No subgreddit like that");
    }
    const requestArray = subgreddit.Requests;
    console.log(requestArray);
    const usernames = requestArray.includes(user);
    console.log(usernames);
    if (!usernames) {
      console.log("not in requests!");
      return res
        .status(404)
        .send({ errors: [{ msg: "user not in requests!" }] });
    }
    const index = requestArray.indexOf(user);
    if (index > -1) {
      requestArray.splice(index, 1); // 2nd parameter means remove one item only
    }
    console.log(requestArray);
    const userArray = subgreddit.Users;
    userArray.push(user);
    subgreddit.Users = userArray;
    subgreddit.Requests = requestArray;
    await subgreddit.save();
    console.log(subgreddit);
    res.send(subgreddit);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

//deleting requests
router.put("/deletingrequests", auth, async (req, res) => {
  try {
    const { subName, user } = req.body;
    // console.log(subName, user);
    const userId = req.user.id;
    const name = await User.findById(userId);
    console.log(name.username);
    const subgreddit = await SubGreddit.findOne({
      Owner: name.username,
      Name: subName,
    });
    if (!subgreddit) {
      console.log("No subgreddit like that");
      return res.status(404).send("No subgreddit like that");
    }
    const requestArray = subgreddit.Requests;
    console.log(requestArray);
    const usernames = requestArray.includes(user);
    console.log(usernames);
    if (!usernames) {
      console.log("not in requests!");
      return res
        .status(404)
        .send({ errors: [{ msg: "user not in requests!" }] });
    }
    const index = requestArray.indexOf(user);
    if (index > -1) {
      requestArray.splice(index, 1); // 2nd parameter means remove one item only
    }
    console.log(requestArray);
    subgreddit.Requests = requestArray;
    await subgreddit.save();
    console.log(subgreddit);
    res.send(subgreddit);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

//delete subgreddits
router.post("/deletesub", auth, async (req, res) => {
  try {
    const { Name: Name } = req.body;
    // console.log(Name);
    const waiting = await SubGreddit.findOneAndDelete({
      Name,
    }).then((response) => {
      console.log("done, in backend");
      return res.status(200).send("done, from backend");
      //   location.reload(true);
    });
    if (!waiting) {
      console.log("No subgreddit like that");
      return res.status(404).send("No subgreddit like that");
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

//create different links for each sub greddit
router.get("/:name", (req, res) => {
  console.log(req.params);
  const { postId } = req.params;
  if (postId > 0) res.send("Hello again cutie");
  console.log("invalid post id");
  res.status(400).send("Invalid Post Id");
});
export default router;
