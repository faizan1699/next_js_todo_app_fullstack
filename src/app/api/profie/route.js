
import User from "@/models/usermodels";
import connect from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";

connect();

export async function POST(req) {
  try {
    const reqBody = req.json();
    const { email } = reqBody;

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json({
        message: "user profile available",
      });
    } else {
      return NextResponse.json({
        message: "error to fetch user profile",
      });
    }

    const userData = {
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isverified: user.isemailverified,
    };

    const response = await NextResponse.json({ userData }, { status: 200 });
    return response;

  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
