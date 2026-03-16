import { NextRequest, NextResponse } from "next/server";
import { GroqService } from "@/services/groq.service";
import { InterviewLevel, InterviewLanguage } from "@/types/interview.type";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const { sessionId, userId, level, language, previousQuestions, previousAnswers, currentAnswer, lastMessageId } = body as {
            sessionId: string;
            userId: string;
            level: InterviewLevel;
            language: InterviewLanguage;
            previousQuestions: string[];
            previousAnswers: string[];
            currentAnswer: string;
            lastMessageId: string;
        };

        if (!sessionId || !userId || !level || !language || !currentAnswer || !lastMessageId) {
            return NextResponse.json(
                {
                    error: "Missing required fields: sessionId, userId, level, language, currentAnswer, lastMessageId",
                },
                { status: 400 }
            );
        }

        // Generate next question
        const result = await GroqService.generateNextQuestion(
            level,
            language,
            sessionId,
            userId,
            previousQuestions || [],
            previousAnswers || [],
            currentAnswer,
            lastMessageId
        );

        return NextResponse.json({ question: result.question, questionId: result.questionId });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to generate next question";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
