import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { sendConfirmationEmail } from "@/lib/mailer";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const currentLocale = req.headers.get('x-locale') || 'en';
    const { userId, code } = await req.json();

    if (!userId || !code) {
      return NextResponse.json({ error: "User ID and code are required" }, { status: 400 });
    }

    const usersCol = await getCollection("users");
    if (!usersCol) {
      return NextResponse.json({ error: "Users collection not found" }, { status: 500 });
    }

    // Find the user by ID
    const user = await usersCol.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    if (user.isVerified) {
      return NextResponse.json({ success: true, message: "User already verified" }, { status: 200 });
    }

    if (user.verificationCode !== code || user.verificationExpires < new Date()) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
    }

    // Update user to verified
    await usersCol.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { isVerified: true },
        $unset: { verificationCode: "", verificationExpires: "" }
      }
    );

    // Send confirmation email
    await sendConfirmationEmail(user.email, user.firstName, currentLocale || 'ca');

    return NextResponse.json({ success: true, message: "Email verified successfully" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
