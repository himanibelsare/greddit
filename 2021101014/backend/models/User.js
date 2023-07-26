import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  firstname: String,
  lastName: String,
  age: Number,
  number: Number,
  email: String,
  username: String,
  password: String,
  savedPosts: Array,
});

// cant use arrow function here
UserSchema.methods.checkPassword = async function (password) {
  // console.log("in check password");
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  const payload = {
    user: {
      id: this._id,
    },
  };
  const secret = process.env.SECRET_KEY;
  const token = jwt.sign(payload, secret, { expiresIn: 360000 });
  return token;
};

const User = mongoose.model("users", UserSchema);

export default User;
