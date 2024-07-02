import User from "@/models/usermodels";
import TodoModel from "@/models/todos";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";

export async function GET(req) {
  try {
    await connect();

    const userId = User._id;
    const todos = await TodoModel.find({ users: userId });

    return NextResponse.json({
      todos,
      message: "Todos retrieved successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse({ message: error.message }, { status: 500 });
  }
}
