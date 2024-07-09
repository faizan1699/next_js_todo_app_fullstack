import { connect } from "@/dbconfig/dbconfig";
import TodoModel from "@/models/todos";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connect();

    const { todoId } = req.body;

    const delTodo = await TodoModel.findByIdAndDelete(todoId);

    if (!delTodo) {
      return NextResponse.json(
        {
          message: "Todo not deleted",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        delTodo,
        message: "Todo deleted successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting todo:", err);
    return NextResponse.json({
      status: "error",
      message: err.message,
    });
  }
}
