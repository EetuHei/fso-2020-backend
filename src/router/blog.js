const { Router, request } = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const blogRouter = new Router();

const getAll = async (req, res, next) => {
  const allBlogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  res.json(allBlogs).end();
};

const addNew = async (req, res, next) => {
  const body = req.body;

  const decodedToken = jwt.verify(req.token, config.SECRET);
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ Error: "token missing on invalid" });
  } else {
    const user = await User.findById(decodedToken.id);

    if (!body.title || !body.url) {
      res.status(400).end();
    } else {
      if (!body.likes) body.likes = 0;

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id,
      });

      const addBlog = await blog.save();

      user.blogs = user.blogs.concat(addBlog._id);
      await user.save();

      await addBlog.populate("user", { username: 1, name: 1 }).execPopulate();
      res.json(addBlog).end();
    }
  }
};

const getById = async (req, res, next) => {
  const findBlog = await Blog.findById({ _id: req.params.id });
  findBlog ? res.json(findBlog.toJSON()) : res.status(404).end();
};

const deleteById = async (req, res, next) => {
  await Blog.deleteOne({ _id: req.params.id });
  res.status(204).end();
};

const updateById = async (req, res, next) => {
  const body = req.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updateBlog = await Blog.findByIdAndUpdate(
    { _id: req.params.id, new: true },
    blog
  );
  res.json(updateBlog.toJSON()).end();
};

blogRouter.get("/blogs", getAll);
blogRouter.post("/blogs", addNew);
blogRouter.get("/blogs/:id", getById);
blogRouter.delete("/blogs/:id", deleteById);
blogRouter.put("/blogs/:id", updateById);

module.exports = blogRouter;
