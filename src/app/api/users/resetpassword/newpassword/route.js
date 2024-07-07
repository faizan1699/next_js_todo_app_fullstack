import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/usermodels";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { otp, email, password } = reqBody;

    // Validate if otp exists in request body
    if (!otp) {
      return NextResponse.json(
        { message: "otp is required" },
        { status: 400 }
      );
    }
    if (!password) {
      return NextResponse.json(
        { message: "password is required" },
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

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Clear sensitive fields after OTP verification
    user.otp = undefined;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    user.password = hashedPassword;

    await user.save(); // Save updated user object

    // Respond with success message
    return NextResponse.json({
      message: "your password updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error during OTP or pasword updating:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
