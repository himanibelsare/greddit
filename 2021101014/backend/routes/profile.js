import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.get("/", auth, async (req, res) => {
  try {
    // console.log(req.user.id);
    const userId = req.user.id;
    let user = await User.findById(userId);
    if (user) {
      return res.send(user);
    } else {
      return res.status(400).send("Invalid User Id");
    }
  } catch (err) {
    console.log(err);
  }
});

router.put("/editprofile", auth, async (req, res) => {
  try {
    // console.log("in edit profile api");
    // console.log(req.body);
    const { firstname, lastName, age, number, email, username, password } =
      req.body;
    // console.log(firstname, lastName, age, number, email, username, password);

    const userId = req.user.id;
    let user = await User.findById(userId);
    if (user) {
      user.firstname = firstname;
      user.lastName = lastName;
      user.age = age;
      user.number = number;
      user.email = email;
      user.username = username;
      user.password = password;
      await user.save();
      res.send(user);
    } else {
      res.status(400).send("Invalid User Id");
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

export default router;
