import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/usermodels";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmailVerification } from "@/nodemailer/mailer";

export async function POST(req) {
  try {
    await connect();

    const reqbody = await req.json();

    const { username, email, password } = reqbody;
    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json({ message: "User already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const saveduser = await newUser.save();

    console.log(saveduser._id);
    await sendEmailVerification({
      email,
      userId: saveduser._id,
    });

    return NextResponse.json({
      message: "user registered successfully",
      success: true,
      saveduser,
    });
  } catch (error) {
    return NextResponse.json({ message: "error.messagesss" }, { status: 500 });
  }
}
