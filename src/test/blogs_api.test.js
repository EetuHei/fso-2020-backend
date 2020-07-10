const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../app");
const Blog = require("../models/blog");
const helper = require("./api_test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  await Blog.insertMany(helper.initialBlogs);
});

describe("when there is initially some blogs saved", () => {
  test("returns blogs as json", async () => {
    await api
      .get("/api/v1/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/v1/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("there are initially two blogs", async () => {
    const response = await api.get("/api/v1/blogs");
    expect(response.body).toHaveLength(2);
  });

  test("a specific author is within the returned blogs", async () => {
    const response = await api.get("/api/v1/blogs");
    const contents = response.body.map((r) => r.author);
    expect(contents).toContain("Michael Chan");
  });

  test("have 'id' as identifying field", async () => {
    const res = await api.get("/api/v1/blogs");
    res.body.forEach((blog) => expect(blog.id).toBeDefined());
  });
});

describe("viewing a specific blog", () => {
  test("succeeds with a valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/v1/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(resultBlog.body).toEqual(blogToView);
  });

  test("fails with statuscode 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();

    console.log(validNonexistingId);

    await api.get(`/api/v1/blogs/${validNonexistingId}`).expect(404);
  });

  test("fails with statuscode 400 id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api.get(`/api/v1/blogs/${invalidId}`).expect(400);
  });
});

describe("addition of a new blog", () => {
  test("succeeds with valid data", async () => {
    const newBlog = {
      title: "Test title",
      author: "Testerino author",
      url: "https://testerino.test/",
      likes: 0,
    };

    await api
      .post("/api/v1/blogs")
      .send(newBlog)
      .set("Authorization", `bearer ${await helper.getToken()}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((blog) => blog.title);
    expect(contents).toContain("Test title");
  });

  test("fails with status code 400 if data invaild", async () => {
    const testBlog = {
      title: "",
      author: "Michael Chan",
      url: "",
      likes: 7,
    };

    await api
      .post("/api/v1/blogs")
      .send(testBlog)
      .set("Authorization", `bearer ${await helper.getToken()}`)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("set likes to 0 if its missing for the req", async () => {
    const testBlog = {
      title: "test title",
      author: "test author",
      url: "http://test.test",
    };

    const res = await api
      .post("/api/v1/blogs")
      .send(testBlog)
      .set("Authorization", `bearer ${await helper.getToken()}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(res.body.likes).toBe(0);
  });
});

describe("update data of single blog", () => {
  test("succeeds with status code 200 if update was successful", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const updateSecondBlog = {
      title: "React-native patterns",
      author: "Chan Michael",
      url: "https://react-nativepatterns.com/",
      likes: 10,
    };

    const blogToUpdate = blogsAtStart[1];

    await api
      .put(`/api/v1/blogs/${blogToUpdate.id}`)
      .send(updateSecondBlog)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();

    const contents = blogsAtEnd.map((blog) => blog.title);

    expect(contents).not.toContain(blogToUpdate.title);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const newBlog = new Blog({
      title: "testerino",
      author: "test test",
      url: "test.test.test",
      likes: 1000,
    });

    const res = await api
      .post("/api/v1/blogs")
      .set("Authorization", `bearer ${await helper.getToken()}`)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogToDelete = res.body;

    await api
      .delete(`/api/v1/blogs/${blogToDelete.id}`)
      .set("Authorization", `bearer ${await helper.getToken()}`)
      .expect(204);

    const blogsatEnd = await helper.blogsInDb();
    expect(blogsatEnd).toHaveLength(helper.initialBlogs.length);

    const contents = blogsatEnd.map((data) => data.title);
    expect(contents).not.toContain(blogToDelete.title);
  });
});

afterAll(async (done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});
