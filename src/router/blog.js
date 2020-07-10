const { Router } = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const blogRouter = new Router();

const getAll = async (req, res, next) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  res.json(blogs.map((blog) => blog.toJSON()));
};

const getById = async (req, res, next) => {
  const blog = await Blog.findOne({ _id: req.params.id });
  if (!blog) {
    return res.status(404).end();
  }
  return res.json(blog).end();
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
        userId: user.id,
      });

      const addBlog = await blog.save();

      user.blogs = user.blogs.concat(addBlog._id);
      await user.save();

      await addBlog.populate("user", { username: 1, name: 1 }).execPopulate();
      res.json(addBlog).end();
    }
  }
};

const deleteById = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, config.SECRET);

  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ Error: "token missing or invalid" });
  }

  const blog = await Blog.findById({ _id: req.params.id });

  if (blog.userId.toString() !== decodedToken.id.toString()) {
    return res.status(401).json({ Error: "premission denied" });
  }

  await Blog.findByIdAndRemove(req.params.id);
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
blogRouter.get("/blogs/:id", getById);
blogRouter.post("/blogs", addNew);
blogRouter.delete("/blogs/:id", deleteById);
blogRouter.put("/blogs/:id", updateById);

module.exports = blogRouter;
