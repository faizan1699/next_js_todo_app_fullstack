import nodemailer from "nodemailer";
import User from "@/models/usermodels";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export const sendEmailVerification = async ({ email, userId }) => {
  try {
    // Create hash token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Calculate token expiry for 2 hours from now
    const tokenExpiry = Date.now() + 2 * 60 * 60 * 1000; // Expiry in milliseconds

    // Update user document based on email type
    const updateFields = {};

    updateFields.verifyToken = hashedToken;
    updateFields.verifyTokenExpiry = tokenExpiry;

    await User.findByIdAndUpdate(userId, updateFields);

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
      subject: "Verify your email",
      html: `<p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
  <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">
    Click here for verification</a>
  to verify your email or copy and paste the link below in your browser.
  <br>
  <span style="font-size: 14px; color: #333333;">${process.env.DOMAIN}/verifyemail?token=${hashedToken}</span>
</p>
`,
    };

    // Send email
    const mailResponse = await transporter.sendMail(mailOption);
    return mailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "A server error occurred" },
      { status: 500 }
    );
  }
};
