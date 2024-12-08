import Todos from "../modals/todo.js";

function addTodo(req, res) {
  const { title, description } = req.body;
  if (!title || title.length == 0 || !description || description.length == 0) {
    return res.status(400).json({ success: false, message: "invalid data" });
  }

  // create : It's a method provided by mongoose to insert a dcoument
  Todos.create({
    title: title,
    description: description,
    ownerOfTodo: req.authUser.userId,
  })
    .then(() => {
      return res.status(200).json({ success: true, message: "Todo Created" });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: err });
    });
}

function getAllTodos(req, res) {
  const userId = req.authUser.userId;
  Todos.find({ ownerOfTodo: userId })
    .populate("ownerOfTodo", "name email")
    .then((data) => {
      return res.status(200).json({ success: true, todos: data });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: err });
    });
}

function updateTodo(req, res) {
  const userId = req.authUser.userId;
  const { id2, title2, description2 } = req.body;

  Todos.findOneAndUpdate(
    { _id: id2, ownerOfTodo: userId },
    {
      title: title2,
      description: description2,
    }
  )
    .then(() => {
      return res.status(200).json({ success: true, message: "Todo Updated" });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: err });
    });
}

function deleteTodo(req, res) {
  const userId = req.authUser.userId;
  const { id } = req.params;
  Todos.findOneAndDelete({
    _id: id,
    ownerOfTodo: userId,
  })
    .then((data) => {
      if (data)
        return res
          .status(200)
          .json({ success: true, message: "Document Deleted" });
      else
        return res
          .status(400)
          .json({ success: true, message: "Document Couldn't find" });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err });
    });
}

export { addTodo, getAllTodos, updateTodo, deleteTodo };
