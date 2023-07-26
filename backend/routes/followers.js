import express from "express";
import Follower from "../models/Follower.js";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
const router = express.Router();

//getting followers
router.put("/getfollowers", auth, async (req, res) => {
  try {
    const { username } = req.body;
    const follower = await Follower.find({ myUsername: username });
    const newArray = follower.map((element) => element.myFollower);
    // console.log(newArray);
    res.send(newArray);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

//getting following
router.put("/getfollowing", auth, async (req, res) => {
  try {
    const { username } = req.body;
    const follower = await Follower.find({ myFollower: username });
    const newArray = follower.map((element) => element.myUsername);
    // console.log(newArray);
    res.send(newArray);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

// following people
router.put("/addfollowers", auth, async (req, res) => {
  try {
    const { myUsername } = req.body;
    const userId = req.user.id;
    const name = await User.findById(userId);
    const myFollower = name.username;
    console.log(myUsername, myFollower);
    if (myUsername != myFollower) {
      const doesFollowerExist = await User.countDocuments({
        username: myFollower,
      });
      const doIexist = await User.countDocuments({
        username: myUsername,
      });
      if (doesFollowerExist && doIexist) {
        const alreadyFollowing = await Follower.countDocuments({
          myUsername: myUsername,
          myFollower: myFollower,
        });

        if (!alreadyFollowing) {
          const follower = new Follower({
            myUsername,
            myFollower,
          });
          await follower.save();
          return res.send("follower added");
        } else {
          return res
            .status(400)
            .send({ errors: [{ msg: "already following!" }] });
        }
      } else {
        return res
          .status(400)
          .send({ errors: [{ msg: "User does not exist" }] });
      }
    } else {
      return res
        .status(400)
        .send({ errors: [{ msg: "Cannot Follow yourself" }] });
    }
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

//removing followers
router.put("/removefollowers", auth, async (req, res) => {
  try {
    const { myFollower } = req.body;
    const userId = req.user.id;
    const name = await User.findById(userId);
    // console.log(name);
    const user = name.username;
    // console.log(user, myFollower);
    const waiting = await Follower.findOneAndDelete({
      myUsername: user,
      myFollower: myFollower,
    }).then((response) => {
      console.log("done, in backend");
      return res.status(200).send("done, from backend");
      //   location.reload(true);
    });
    if (!name || !waiting) {
      console.log("No follower found to delete");
      res.status(404).send("No follower found to delete");
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

//unfollowing people
router.put("/removefollowing", auth, async (req, res) => {
  try {
    const { imFollowing } = req.body;
    const userId = req.user.id;
    const name = await User.findById(userId);
    // console.log(name);
    const user = name.username;
    console.log(user, imFollowing);
    const waiting = await Follower.findOneAndDelete({
      myUsername: imFollowing,
      myFollower: user,
    }).then((response) => {
      console.log("done, in backend");
      return res.status(200).send("done, from backend");
      //   location.reload(true);
    });
    if (!name || !waiting) {
      console.log("No follower found to delete");
      res.status(404).send("No follower found to delete");
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

export default router;
