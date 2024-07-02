import nodemailer from "nodemailer";
import User from "@/models/usermodels";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export const sendresetPasswordcode = async ({ email, userId, otp }) => {
  try {
    const hashedToken = await bcryptjs.hash(userId, 10);

    // Calculate token expiry for 2 hours from now
    const tokenExpiry = Date.now() + 2 * 60 * 60 * 1000; // Expiry in milliseconds
    // Update user document based on email type

    await User.findByIdAndUpdate(userId, {
      otp: otp,
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: tokenExpiry,
    });

    const transporter = await nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "6df92a77536bbd",
        pass: "0a39e2add92184",
      },
    });

    // Email options
    const mailOption = {
      from: "todoapp@gmail.com",
      to: email,
      subject: "Password Reset otp",
      html: `<h3 style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">Your reset password otp is: <span style="font-size: 14px; color: red;" >${otp}</span></h3>`,
    };

    // Send email
    const mailResponse = await transporter.sendMail(mailOption);
    return mailResponse;
  } catch (error) {
    console.error("Error sending email from backend:", error, { status: 500 });
    return NextResponse.json(
      { message: "A server error occurred" },
      { status: 500 }
    );
  }
};
