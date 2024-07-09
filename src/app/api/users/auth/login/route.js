import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/usermodels";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

import jwt from "jsonwebtoken";

export async function POST(req, res) {
  try {
    await connect();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        { message: `Please first verify your email to login ${email}` },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    const tokenData = {
      userId: user._id,
      username: user.username,
      email: user.email,
      admin: user.isAdmin,
      isverified: user.isEmailVerified,
    };
    
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    const response = NextResponse.json(
      {
        message: "Login successful",
        success: true,
        token,
      },
      { status: 200 }
    );

    response.cookies.set("TOKEN", token, {
      httpOnly: true,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: error?.message }, { status: 500 });
  }
}
