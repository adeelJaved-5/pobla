import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCollection } from "@/lib/mongodb";
import { sendResetPasswordEmail } from "@/lib/mailer";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
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

    // Normalize email to lowercase for case-insensitive lookup
    const normalizedEmail = email.toLowerCase().trim();
    // Find user by email (case-insensitive)
    const user = await usersCol.findOne({ 
      email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await usersCol.updateOne(
      { _id: new ObjectId(user._id) },
      { 
        $set: { resetPasswordToken: resetToken, resetPasswordExpiry } 
      }
    );

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Send reset email
    await sendResetPasswordEmail(user.email, user.firstName, resetUrl);

    return NextResponse.json({ success: true, message: "Reset email sent" }, { status: 200 });

  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
