import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, origin } = body;

    if (!email || !phone || !origin) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const usersCol = await getCollection("users");
    if (!usersCol) {
      return NextResponse.json(
        { error: "Users collection not found" },
        { status: 500 }
      );
    }

    const result = await usersCol.findOneAndUpdate(
      { email },
      { $set: { phone, origin } },
      { returnDocument: "after" } 
    );

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Information updated successfully", user: result },
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
