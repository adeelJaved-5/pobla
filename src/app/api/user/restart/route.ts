import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { getCollection } from "@/lib/mongodb";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const usersCol = await getCollection("users");
    if (!usersCol) {
      return NextResponse.json(
        { message: "Users collection not found" },
        { status: 500 }
      );
    }

    const updateResult = await usersCol.updateOne(
      { email: session.user.email },
      {
        $set: {
          points: 0,
          currentLevel: 1,
          POIsCompleted: 0,
          hasSeenPopup: false,
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User progress reset successfully",
    });
  } catch (error) {
    console.error("PATCH /api/user error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
