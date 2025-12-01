import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

// ==================== GET ====================
export async function GET() {
  try {
    const usersCol = await getCollection("users");
    if (!usersCol) {
      return NextResponse.json(
        { message: "Users collection not found" },
        { status: 500 }
      );
    }

      const users = await usersCol
      .find({}, { projection: { firstName: 1, lastName: 1, points: 1 } }) 
      .sort({ points: -1 }) 
      .toArray();

    return NextResponse.json({
      message: "Ranking fetched successfully",
      user: users,
    });
  } catch (error) {
    console.error("GET /api/user/ranking error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
