import { NextRequest, NextResponse } from "next/server";

import { GroqService } from "@/services/groq.service";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const { sessionId, content, repliedMessageId, userId } = body as {
            sessionId: string;
            content: string;
            repliedMessageId: string;
            userId: string;
        };

        if (!sessionId) {
            return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
        }

        if (!content) {
            return NextResponse.json({ error: "content is required" }, { status: 400 });
        }

        if (!repliedMessageId) {
            return NextResponse.json({ error: "repliedMessageId is required" }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        await GroqService.saveUserAnswer(sessionId, content, repliedMessageId, userId);

        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to save user answer";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
