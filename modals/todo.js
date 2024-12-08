import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: false,
    default: false,
  },
  ownerOfTodo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AugBatchIITHUsers",
    required: true,
  },
});

const Todos = mongoose.model("AugBatchIITHTodo", todoSchema);

export default Todos;
