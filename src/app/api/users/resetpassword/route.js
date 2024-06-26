import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/usermodels";

import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { sendEmail } from "@/nodemailer/mailer";

const secret = "your-secret-key"; // Ensure you have a secure way to store and access your secret key

export async function POST(req) {
  try {
    await connect();

    const { email } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate a token
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      secret,
      { expiresIn: "1h" }
    );

    // Save token and expiration date in the user's document
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    await sendEmail({
      email,
      emailType: "RESET",
      userId: token,
    });

    return NextResponse.json(
      { message: "Password reset token generated and sent" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "A server error occurred" },
      { status: 500 }
    );
  }
}
