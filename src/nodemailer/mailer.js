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
      html: `<div
        style="width: 75%; background-color: rgb(214, 230, 214); padding: 50px 10px; margin: 20px auto; border-radius: 20px; ">
        <a style="margin: auto; display: flex; justify-content: center; background-color: rgb(10, 10, 10); color: aliceblue; text-decoration: none;  padding: 10px 0; width: 300px; border-radius: 10px; "
            href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">
            Click here to verify email
        </a>
        <p style="font-family: Arial, sans-serif; font-size: 20px; line-height: 1.5; color: #630000;">
            To verify your email or copy and paste the link below in your browser.
            <br>
            <span style="font-size: 14px; padding: 0 auto; color: #0d0179e8;">${process.env.DOMAIN}/verifyemail?token=${hashedToken}</span>
        </p>
    </div>`,
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
