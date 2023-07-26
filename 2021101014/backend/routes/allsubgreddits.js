import express from "express";
import auth from "../middleware/auth.js";
import SubGreddit from "../models/SubGreddit.js";
import User from "../models/User.js";
const router = express.Router();

//"/api/allsubgreddits"

// get deets of subgreddits
router.get("/getjoinedsubs", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const name = await User.findById(userId);
    const user = name.username;
    const allSubgreddits = await SubGreddit.find();
    // console.log(allSubgreddits);
    const subgreddits = [];
    allSubgreddits.forEach(function (arrayItem) {
      var Users = arrayItem.Users;
      if (Users.includes(user)) {
        subgreddits.push(arrayItem);
      }
    });

    res.send(subgreddits);
  } catch (err) {
    console.error("Error:", err);
    res.send(err);
  }
});
router.get("/getothersubs", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const name = await User.findById(userId);
    const user = name.username;
    const allSubgreddits = await SubGreddit.find();
    // console.log(allSubgreddits);
    const subgreddits = [];
    allSubgreddits.forEach(function (arrayItem) {
      var Users = arrayItem.Users;
      if (!Users.includes(user)) {
        subgreddits.push(arrayItem);
      }
    });

    res.send(subgreddits);
  } catch (err) {
    console.error("Error:", err);
    res.send(err);
  }
});

// get deets of subgreddits
router.put("/getdetails", auth, async (req, res) => {
  try {
    const { subName } = req.body;
    // console.log(subName);
    const subgreddits = await SubGreddit.findOne({
      Name: subName,
    });
// need to check if the logged in user is part of the users of this subgreddit or not
    // console.log(subgreddits);
    res.send(subgreddits);
  } catch (err) {
    console.error("Error:", err);
    res.send(err);
  }
});

//leaving subgreddits
router.put("/leavingsubs", auth, async (req, res) => {
  try {
    const { subName } = req.body;
    // console.log(subName, user);
    const userId = req.user.id;
    const name = await User.findById(userId);
    const user = name.username;
    console.log(name.username);
    const subgreddit = await SubGreddit.findOne({
      Name: subName,
    });
    if (!subgreddit) {
      console.log("No subgreddit like that");
      return res.status(404).send("No subgreddit like that");
    }
    if (subgreddit.Owner === user) {
      console.log("Can't leave the sub you made!");
      return res.status(404).send("Can't leave the sub you made!");
    }
    const userArray = subgreddit.Users;
    console.log(userArray);
    const usernames = userArray.includes(user);
    console.log(usernames);
    if (!usernames) {
      console.log("not a user!");
      return res.status(404).send({ errors: [{ msg: "not a user!" }] });
    }
    const index = userArray.indexOf(user);
    if (index > -1) {
      userArray.splice(index, 1); // 2nd parameter means remove one item only
    }
    const leftArray = subgreddit.LeftUsers;
    leftArray.push(user);
    console.log(leftArray);
    console.log(userArray);
    subgreddit.Users = userArray;
    subgreddit.LeftUsers = leftArray;
    await subgreddit.save();
    console.log(subgreddit);
    res.send(subgreddit);
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
