import { NextRequest, NextResponse } from "next/server";
import { GroqService } from "@/services/groq.service";
import { InterviewLevel, InterviewLanguage } from "@/types/interview.type";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const { question, answer, level, language } = body as {
            question: string;
            answer: string;
            level: InterviewLevel;
            language: InterviewLanguage;
        };

        if (!question || !answer || !level || !language) {
            return NextResponse.json({ error: "Missing required fields: question, answer, level, language" }, { status: 400 });
        }

        if (!["intern", "fresher", "junior", "middle", "senior", "leader"].includes(level)) {
            return NextResponse.json({ error: "Invalid level" }, { status: 400 });
        }

        if (!["vietnamese", "english"].includes(language)) {
            return NextResponse.json({ error: "Invalid language" }, { status: 400 });
        }

        const evaluation = await GroqService.evaluateResponse(question, answer, level, language);

        return NextResponse.json(evaluation);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to evaluate response";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
