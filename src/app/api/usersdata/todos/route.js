import { connect } from "@/dbconfig/dbconfig";
import TodoModel from "@/models/todos";
import User from "@/models/usermodels";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connect();

    const reqBody = await req.json();
    const { todo, description } = reqBody;

    const userId = User._id;

    if (!description && !todo) {
      return NextResponse.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    } else if (!todo) {
      return NextResponse.json(
        { message: "Title are required" },
        { status: 400 }
      );
    } else if (!description) {
      return NextResponse.json(
        { message: "description are required" },
        { status: 400 }
      );
    }

    const newTodo = new TodoModel({
      todo, // Changed from title to todo
      description,
      user: userId,
    });

    const savedTodo = await newTodo.save();

    return NextResponse.json({
      message: "Todo saved successfully",
      success: true,
      savedTodo,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
