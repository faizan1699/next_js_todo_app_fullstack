import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/usermodels";
import { NextRequest, NextResponse } from "next/server";

// Establish a connection to the database
connect();

export async function POST(req) {
    try {
        await connect(); // Ensure the database connection

        const reqBody = await req.json();
        const { token } = reqBody;

        console.log("Received token:", token);

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: new Date() } // Use new Date() to ensure proper date handling
        });

        if (!user) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        console.log("User found:", user);

        // Update user verification status
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        });

    } catch (error) {
        console.error("Error during email verification:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
