import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/usermodels";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(req) {
  try {
    await connect();

    const reqBody = await req.json();
    const { token } = reqBody;

    console.log("Received token:", token);

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }
    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 }
      );
    }
    console.log("User found:", user);

    // Update user verification status
    user.isEmailVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error during email verification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
