const app = require("../../app");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const User = require("../models/part4/user");
const helper = require("./api_test_helper");
const mongoose = require("mongoose")

const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secret", 10);

    const user = new User({
      username: "root",
      name: "root",
      password: passwordHash,
    });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "eetuhei",
      name: "Eetu Heikkinen",
      password: "salainen",
    };

    await api
      .post("/api/v1/signup")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
});

afterAll(async (done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});
