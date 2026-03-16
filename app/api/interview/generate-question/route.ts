import { NextRequest, NextResponse } from "next/server";

import { GroqService } from "@/services/groq.service";

import { InterviewLevel, InterviewLanguage } from "@/types/interview.type";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const { level, language, sessionId, userId, type, context } = body as {
            level: InterviewLevel;
            language: InterviewLanguage;
            sessionId: string;
            userId: string;
            type: "initial" | "next";
            context?: {
                previousQuestions: string[];
                previousAnswers: string[];
                currentAnswer: string;
                lastMessageId: string;
            };
        };

        if (!level || !["intern", "fresher", "junior", "middle", "senior", "leader"].includes(level)) {
            return NextResponse.json({ error: "Invalid level" }, { status: 400 });
        }

        if (!language || !["vietnamese", "english"].includes(language)) {
            return NextResponse.json({ error: "Invalid language" }, { status: 400 });
        }

        if (!sessionId) {
            return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        let result: { question: string; questionId: string };

        if (type === "initial") {
            result = await GroqService.generateInitialQuestion(level, language, sessionId, userId);
        } else if (type === "next" && context) {
            const { previousQuestions, previousAnswers, currentAnswer, lastMessageId } = context;
            result = await GroqService.generateNextQuestion(
                level,
                language,
                sessionId,
                userId,
                previousQuestions,
                previousAnswers,
                currentAnswer,
                lastMessageId || ""
            );
        } else {
            return NextResponse.json({ error: "Invalid type or missing context" }, { status: 400 });
        }

        return NextResponse.json({ question: result.question, questionId: result.questionId });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to generate question";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
