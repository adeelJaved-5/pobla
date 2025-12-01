import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mailer";
import { getCollection } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const currentLocale = req.headers.get('x-locale') || 'en';
    const body = await req.json();
    const { firstName, lastName, email, password, phone, origin } = body;

    if (!firstName || !lastName || !email || !password || !phone || !origin) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }


    const usersCol = await getCollection("users");
    if (!usersCol) {
      return NextResponse.json({ error: "Users collection not found" }, { status: 500 });
    }

    // Check if user already exists
    const existingUser = await usersCol.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);


    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    const result = await usersCol.insertOne({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      origin,
      verificationCode,
      verificationExpires:expires,
      hasSeenPopup: false,
      points: 0,
      currentLevel: 1,
      POIsCompleted: 0,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await sendVerificationEmail(email, verificationCode, firstName, currentLocale || 'ca');

    return NextResponse.json({
      message: "User registered successfully. Please check your email for verification code.",
      user: result,
      userId: result.insertedId
    }, { status: 201 });


  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
