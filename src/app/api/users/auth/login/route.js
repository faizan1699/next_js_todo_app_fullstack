import { connect } from '@/dbconfig/dbconfig';
import User from '@/models/usermodels';
import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';

export async function POST(req) {
    try {
        await connect();

        const { email, password } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 });
        }

        if (!user.isVerified) {
            return NextResponse.json({ message: `pls first verify your email to login ${email}` }, { status: 403 });
        }

        return NextResponse.json({ message: "Login successful", success: true }, { status: 200 });

    } catch (error) {
        console.error("Server response error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
