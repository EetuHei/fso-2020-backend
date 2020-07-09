const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authRouter = new Router();

const signup = async (req, res, next) => {
  const body = req.body;

  if (!body.password || body.password.length <= 3) {
    res
      .status(400)
      .send({ Error: "Password should be atleast 3 character long" })
      .end();
  } else {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      password: passwordHash,
    });

    const savedUser = await user.save();

    res.json(savedUser).end();
  }
};

const login = async (req, res, next) => {
  const body = req.body;

  const user = await User.findOne({ username: body.username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.password, user.password);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  res.status(200).send({ token, username: user.username, name: user.name });
};

const getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.json(users).end();
};

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/users", getUsers);

module.exports = authRouter;
