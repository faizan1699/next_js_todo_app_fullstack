import { connect } from "@/dbconfig/dbconfig";
import TodoModel from "@/models/todos";
import User from "@/models/usermodels";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connect();

    const reqBody = await req.json();
    const { todo, description, email } = reqBody;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create new TodoModel with user _id
    const newTodo = new TodoModel({
      todo,
      description,
      user: user._id, 
    });

    const savedTodo = await newTodo.save();

    return NextResponse.json({
      message: "Todo saved successfully",
      success: true,
      savedTodo,
    });
  } catch (error) {
    console.error("Error saving todo:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
