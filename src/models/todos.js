import mongoose from "mongoose";

const todosSchema = new mongoose.Schema(
  {
    todo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const TodoModel = mongoose.models.Todo || mongoose.model("Todo", todosSchema);

export default TodoModel;
