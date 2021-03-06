const Blog = require("../models/part4/blog");
const User = require("../models/part4/user");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const nonExistingId = async () => {
  const blog = new Blog({
    title: "remove",
    author: "remove",
    url: "remove",
    likes: 0,
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const getToken = async () => {
  const users = await usersInDb();
  const user = users[0];
  return jwt.sign(
    {
      username: user.username,
      id: user.id,
    },
    config.SECRET
  );
};

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
  usersInDb,
  getToken,
};
