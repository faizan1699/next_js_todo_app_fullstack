// Import necessary modules and dependencies
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/usermodels"; // Assuming this is the correct import path for your User model
import TodoModel from "@/models/todos"; // Assuming this is the correct import path for your TodoModel
import { connect } from "@/dbconfig/dbconfig"; // Assuming this is the correct import path for your database connection

export async function GET(req) {
  try {
    const token = req.cookies.get("jwtToken");
    const tokenValue = token && typeof token === "object" ? token.value : token;

    if (!tokenValue) {
      const errorMessage = { message: "JWT token is missing" };
      return NextResponse.json(errorMessage, { status: 401 });
    }
   
    let decodedToken;
    try {
      decodedToken = jwt.verify(tokenValue, process.env.JWT_SECRET);
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return NextResponse.json(
        { message: "Invalid JWT token" },
        { status: 401 }
      );
    }

    await connect();

    const userId = decodedToken.userId;

    // Fetch todos associated with the user
    const todos = await TodoModel.find({ user: userId });

    return NextResponse.json({
      todos,
      message: `Todos retrieved successfully ${decodedToken.userId}`,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
