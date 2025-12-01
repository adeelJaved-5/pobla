import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mailer";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const currentLocale = req.headers.get('x-locale') || 'en';
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const usersCol = await getCollection("users");
    if (!usersCol) {
      return NextResponse.json({ error: "Users collection not found" }, { status: 500 });
    }

    // Find the user by ID
    const user = await usersCol.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate new verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

    // Update user document
    await usersCol.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { verificationCode, verificationExpires } 
      }
    );

    // Send email
    await sendVerificationEmail(
      user.email,
      verificationCode,
      `${user.firstName} ${user.lastName}`,
      currentLocale || 'ca'
    );

    return NextResponse.json({ success: true, message: "Verification code resent" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
