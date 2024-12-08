import supertest from "supertest";
import mongoose from "mongoose";
import User from "../modals/user";
import app from "../index.js";

beforeAll(async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ashish1322:kuv58Hn5kFsFTznH@cluster0.88yqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Test Db Connected");
  } catch (err) {
    console.log("Test DB not Connected : ", err.message);
  }
});

beforeEach(async () => {
  await User.deleteMany({});
});

// A group of test cases is defiend using describe
describe("Singup Test Cases", () => {
  it("Account shoule be created", async () => {
    const response = await supertest(app).post("/api/v1/auth/signup").send({
      name: "Ashish",
      email: "a.m2002nov@gmail.com",
      password: "Ashsih123.#4#",
    });
    expect(response.status).toEqual(200);
    expect(response.body.success).toEqual(true);
  });

  it("Email Already Exist", async () => {
    // creating account;
    let response = await supertest(app).post("/api/v1/auth/signup").send({
      name: "Ashish",
      email: "a.m2002nov@gmail.com",
      password: "Ashsih123.#4#",
    });
    expect(response.status).toEqual(200);
    expect(response.body.success).toEqual(true);

    response = await supertest(app).post("/api/v1/auth/signup").send({
      name: "Ashish",
      email: "a.m2002nov@gmail.com",
      password: "Ashsih123.#4#",
    });
    expect(response.status).toEqual(400);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual(
      "Account already exists with given email"
    );
  });
});

describe("Login Test Cases", () => {
  beforeEach(async () => {
    let response = await supertest(app).post("/api/v1/auth/signup").send({
      name: "Ashish",
      email: "a.m2002nov@gmail.com",
      password: "Ashsih123.#4#",
    });
  });

  it("Login with invalid Email", async () => {
    let response = await supertest(app).post("/api/v1/auth/login").send({
      email: "a.m2001nov@gmail.com",
      password: "Ashsih123.#4#",
    });
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("Invalid Email");
  });

  it("Login with invalid Password", async () => {
    let response = await supertest(app).post("/api/v1/auth/login").send({
      email: "a.m2002nov@gmail.com",
      password: "Ashsih123.#4",
    });
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("Invalid Password");
  });

  it("Correct Email And Password", async () => {
    let response = await supertest(app).post("/api/v1/auth/login").send({
      email: "a.m2002nov@gmail.com",
      password: "Ashsih123.#4#",
    });
    expect(response.status).toEqual(200);
    expect(response.body.success).toEqual(true);
  });
});
