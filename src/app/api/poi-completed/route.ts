import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    try {
        const session = await getServerSession({ req, ...authOptions });
        if (!session?.user?.email) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const body = await req.json();
        const { poiCompleted } = body;
        if (!poiCompleted) {
            return new Response(JSON.stringify({ message: "poiCompleted is required" }), { status: 400 });
        }

        const usersCol = await getCollection("users");
        if (!usersCol) return new Response(JSON.stringify({ message: "Users collection not found" }), { status: 500 });


        const user = await usersCol.findOne({ email: session.user.email });
        if (!user) return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });

        let newPOIsCompleted = poiCompleted;
        let newPoints = user.points || 0;
        let newLevel = user.currentLevel || 1;


        const milestones = [3, 6, 9, 12];
        const maxLevel = 4;

        milestones.forEach((milestone, idx) => {
            if (newPOIsCompleted >= milestone && newLevel < idx + 2) {
                newLevel = Math.min(idx + 2, maxLevel);
            }
        });


        await usersCol.updateOne(
            { _id: new ObjectId(user._id) },
            {
                $set: {
                    POIsCompleted: newPOIsCompleted,
                    currentLevel: newLevel,
                    points: newPoints,
                },
            }
        );

        return new Response(
            JSON.stringify({
                message: "POI progress updated",
                POIsCompleted: newPOIsCompleted,
                currentLevel: newLevel,
                points: newPoints,
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
