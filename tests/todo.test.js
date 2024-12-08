import supertest from "supertest";
import mongoose from "mongoose";
import Todos from "../modals/todo.js";
import app from "../index.js";
import User from "../modals/user.js";

// connecting to test db
beforeAll(async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ashish1322:kuv58Hn5kFsFTznH@cluster0.88yqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0g"
    );
  } catch (err) {
    console.log("Test DB not Connected : ", err.message);
  }
});
var token;
// creating one user before all the test cases
beforeAll(async () => {
  await User.deleteMany({});
  await supertest(app).post("/api/v1/auth/signup").send({
    name: "Ashish",
    email: "a.m2002nov@gmail.com",
    password: "Ashsih123.#4#",
  });
  let response = await supertest(app).post("/api/v1/auth/login").send({
    email: "a.m2002nov@gmail.com",
    password: "Ashsih123.#4#",
  });
  token = response.body.user.accessToken;
});

beforeEach(async () => {
  await Todos.deleteMany({});
});

describe("Todos", () => {
  it("Adding the Todos ", async () => {
    // 1. Add todo Without token
    let response = await supertest(app).post("/api/v1/todos/create").send({
      title: " We need to learn things",
      description: "We need to learn lot of programming languges",
    });
    expect(response.status).toEqual(401);
    expect(response.body.message).toEqual("Invalid Access Token");
    // 2. Add todo with Token
    response = await supertest(app)
      .post("/api/v1/todos/create")
      .set("Authorization", token)
      .send({
        title: " We need to learn things",
        description: "We need to learn lot of programming languges",
      });
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual("Todo Created");
  });

  it("Fetching todos", async () => {
    // 1. Create a todo
    let response = await supertest(app)
      .post("/api/v1/todos/create")
      .set("Authorization", token)
      .send({
        title: " We need to learn things",
        description: "We need to learn lot of programming languges",
      });
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual("Todo Created");

    // 2. Read the todos
    response = await supertest(app)
      .get("/api/v1/todos/read")
      .set("Authorization", token);
    expect(response.status).toEqual(200);
    expect(response.body.todos.length).toEqual(1);
  });
});
