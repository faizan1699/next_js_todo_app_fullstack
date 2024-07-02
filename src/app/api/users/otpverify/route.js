import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/usermodels";
import { NextResponse } from "next/server";

// Establish a connection to the database
connect();

export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { otp, email } = reqBody;

    // Validate if otp exists in request body
    if (!otp) {
      return NextResponse.json(
        { message: "OTP is required in request body" },
        { status: 400 }
      );
    }

    // Find user by OTP and ensure OTP is valid
    const user = await User.findOne({
      email: email,
      otp: otp,
      resetPasswordExpiry: { $gt: new Date() },
    });

    // Handle case where user with given OTP is not found or OTP is expired
    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Clear sensitive fields after OTP verification
    user.otp = undefined;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save(); // Save updated user object

    // Respond with success message
    return NextResponse.json({
      message: "OTP Verified Successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
