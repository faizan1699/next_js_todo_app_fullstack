import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/usermodels";
import { NextRequest, NextResponse } from "next/server";

// Establish a connection to the database
connect();

export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { token } = reqBody;

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: new Date() },
    });

    // Handle case where user with given token is not found
    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }
    // Update user verification status and clear token fields
    user.isEmailVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save(); // Save updated user object

    // Respond with success message
    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error during email verification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
