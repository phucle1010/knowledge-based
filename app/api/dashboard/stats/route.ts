import { NextResponse } from "next/server";

import { withAuth } from "@/lib/middlewares/auth";
import { InterviewMessageModel, InterviewResultModel, InterviewSessionModel } from "@/lib/schemas/interview";

import { MongoService } from "@/services/mongo.service";

export const GET = withAuth(async (request) => {
    try {
        await MongoService.connect();

        const userId = request.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessionCount = await InterviewSessionModel.countDocuments({ user_id: userId, deletedAt: null }).exec();
        const messageCount = await InterviewMessageModel.countDocuments({ user_id: userId, deletedAt: null }).exec();

        const sessionIds = await InterviewSessionModel.find({ user_id: userId, deletedAt: null }).distinct("_id").exec();
        const resultCount = await InterviewResultModel.countDocuments({ sessionId: { $in: sessionIds }, deletedAt: null }).exec();

        return NextResponse.json({ sessionCount, messageCount, resultCount });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch dashboard stats";
        return NextResponse.json({ error: message }, { status: 500 });
    }
});
