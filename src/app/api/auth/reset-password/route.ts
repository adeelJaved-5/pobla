import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: "Token and password are required" },
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

    const user = await usersCol.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() }, 
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and remove token & expiry
    await usersCol.updateOne(
      { _id: new ObjectId(user._id) },
      {
        $set: { password: hashedPassword },
        $unset: { resetPasswordToken: "", resetPasswordExpiry: "" }
      }
    );

    return NextResponse.json({ success: true, message: "Password reset successful" }, { status: 200 });
    
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
