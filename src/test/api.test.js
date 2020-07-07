const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const Blog = require("../models/blog");

const api = request(app);

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

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

describe("The get method ", () => {
  test("returns blogs as json", async () => {
    const res = await api
      .get("/api/v1/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/v1/blogs");

  expect(response.body).toHaveLength(initialBlogs.length);
});

test("there are two blogs", async () => {
  const response = await api.get("/api/v1/blogs");

  expect(response.body).toHaveLength(2);
});

test("a specific author is within the returned blogs", async () => {
  const response = await api.get("/api/v1/blogs");

  const contents = response.body.map((r) => r.author);

  expect(contents).toContain("Michael Chan");
});

afterAll(async (done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});
