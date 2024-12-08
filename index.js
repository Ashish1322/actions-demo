// How to creaet a basic web server using express
import express from "express";
import mongoose from "mongoose";
import bodyparser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

// import routes
import todoRoutes from "./routes/todo.js";
import authRoutes from "./routes/auth.js";

// load the env file when programm will be running
dotenv.config();

// creating server
const server = express();

// add middlewares : Global Middleware
server.use(bodyparser.json());
server.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

// define Health  Check API
server.get("/api/v1/healthcheck", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running fine",
  });
});

// add all the routes
server.use("/api/v1/todos", todoRoutes);
server.use("/api/v1/auth", authRoutes);

// connect to database
// mongoose
//   .connect(process.env.DB_URL)
//   .then(() => {
//     console.log("Database Connected");
//     // starting server
//     server.listen(8001, () => {
//       console.log("Server is running on port 8001");
//     });
//   })
//   .catch((err) => console.log("Error while connecting to database ", err));

export default server;
