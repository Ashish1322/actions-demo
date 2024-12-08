import express from "express";
// import controllers
import {
  addTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.js";
// import middlewars
import { isLoggedIn, validateBody } from "../middlewares/auth.js";
import { body } from "express-validator";

const router = express.Router();

// API To Create Todos : POST
router.post(
  "/create",
  isLoggedIn,
  body("title")
    .exists()
    .isLength({ min: 3, max: 40 })
    .withMessage("Title should be minimum of 3 lenght"),
  validateBody,
  addTodo
);

// API To Read All Todos: GET
router.get("/read", isLoggedIn, getAllTodos);

// API To Update Todos: PUT
router.put("/update", isLoggedIn, updateTodo);

// API To Delete the Todo : DELETE
router.delete("/delete/:id", isLoggedIn, deleteTodo);

export default router;
