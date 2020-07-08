const { Router } = require("express");
const Blog = require("../models/blog");

const blogRouter = new Router();

const getAll = async (req, res, next) => {
  const allBlogs = await Blog.find({});
  res.json(allBlogs).end();
};

const addNew = async (req, res, next) => {
  const blog = new Blog(req.body);

  if (!blog.title || !blog.url) {
    res.status(400).end();
  } else {
    if (!blog.likes) blog.likes = 0;
    const addBlog = await blog.save();
    res.json(addBlog.toJSON()).end();
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
