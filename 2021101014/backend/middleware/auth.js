import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  try {
    // auth: bearer <token>
    // x-auth-token: <token>
    // console.log("in auth");
    const token = req.header("x-auth-token");
    // console.log("here", token);

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded.user;
      next();
    } catch (err) {
      return res.status(401).send("Invalid token");
    }
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
}
