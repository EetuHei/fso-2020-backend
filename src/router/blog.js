const { Router } = require("express");
const Blog = require("../models/blog");
const logger = require("../config/logger");

const blogRouter = new Router();

const getAll = async (req, res, next) => {
  try {
    await Blog.find({}).then((blogs) => {
      res.json(blogs);
    });
  } catch (e) {
    console.error(e);
    logger.error(e);
  }
};

const addNew = async (req, res, next) => {
  const blog = new Blog(req.body);
  try {
    await blog.save().then((result) => {
      res.status(201).json(result);
    });
  } catch (e) {
    console.error(e);
    logger.error("Error:", e);
  }
};

blogRouter.get("/blogs", getAll);
blogRouter.post("/blogs", addNew);

module.exports = blogRouter;
