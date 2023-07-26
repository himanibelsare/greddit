import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    res.send(user);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

/**
 * pre or post action
 * user owns multiple ToDos
 */

/**
 * @route /api/users/:id
 * @description Edit name of current user
 * @access Private
 */

//sign in
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log(username, password);
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).send({ errors: [{ msg: "No user found" }] });
    // console.log("here");
    const match = await user.checkPassword(password);
    // console.log(match);
    if (match) {
      const token = user.generateToken();
      //   console.log("reached here");
      return res.send({ token });
    }
    return res.status(400).send({ errors: [{ msg: "Invalid password" }] });
  } catch (err) {
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});
//sign up
router.post("/signup", async (req, res) => {
  try {
    // // console.log("req", req.params, req.body);
    const { firstname, lastName, age, number, email, username, password } =
      req.body;
    // console.log(firstname, lastName, age, number, email, username, password);
    let user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .send({ errors: [{ msg: "Username already exists" }] });
    }
    user = new User({
      firstname,
      lastName,
      age,
      number,
      email,
      username,
      password,
    });
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const token = user.generateToken();
    res.send({ token });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    console.log("req user", req.user);
    // const { id } = req.params;
    const id = req.user.id;
    const { name } = req.body;

    // await User.findByIdAndUpdate(id, {
    //   name,
    //   nickname: "changed nickname",
    //   age: age + 1,
    // });

    // const user = await User.findById(id);

    // user.name = name;

    // await user.save();
    // res.send(user);
    res.send("things worked");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ errors: [{ msg: "Server Error" }] });
  }
});

export default router;
