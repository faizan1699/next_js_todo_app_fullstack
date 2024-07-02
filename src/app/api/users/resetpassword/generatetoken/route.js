import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/usermodels";
import { sendresetPasswordcode } from "@/nodemailer/resetpassword";
import { NextResponse } from "next/server";

connect(); // Connect to the database

export async function POST(req) {
  try {
    const { email } = await req.json(); // Extract email from request body

    const user = await User.findOne({ email }); // Find user by email
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 }); // Return 404 if user not found
    }

    // Generate OTP
    function generateRandomCode() {
      const min = 100000;
      const max = 999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const otpgenrate = generateRandomCode();
    
    // Update user with OTP
    user.otp = otpgenrate;
    await user.save(); // Save the updated user

    // Send reset password email with OTP
    await sendresetPasswordcode({
      email,
      otp: otpgenrate,
      userId: user._id.toString(), // Convert _id to string if needed
    });

    // Respond with success message
    const respond = await NextResponse.json(
      { message: `OTP sent to ${email}` },
      { status: 200 }
    );

    return respond;
  } catch (error) {
    console.error("Error in password reset request:", error);
    // Return server error response
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
