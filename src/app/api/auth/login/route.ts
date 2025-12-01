import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCollection } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }
    const usersCol = await getCollection("users");
    if (!usersCol) {
      return NextResponse.json(
        { success: false, error: "Users collection not found" },
        { status: 500 }
      );
    }

    const user = await usersCol.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: user,
        userId: user._id,
        isVerified: user.isVerified,
        message: user.isVerified
          ? "Login successful!"
          : "Email not verified. Please verify your email first."
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
