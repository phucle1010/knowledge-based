import { NextRequest, NextResponse } from "next/server";
import { GroqService } from "@/services/groq.service";
import { MilvusService } from "@/services/milvus.service";
import { InterviewLevel, InterviewLanguage } from "@/types/interview.type";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const { sessionId, question, answer, questionId, userId, level, language } = body as {
            sessionId: string;
            question: string;
            answer: string;
            questionId: string;
            userId: string;
            level: InterviewLevel;
            language: InterviewLanguage;
        };

        if (!sessionId || !question || !answer || !questionId || !userId || !level || !language) {
            return NextResponse.json(
                {
                    error: "Missing required fields: sessionId, question, answer, questionId, userId, level, language",
                },
                { status: 400 }
            );
        }

        // 1. Save user answer to database
        await GroqService.saveUserAnswer(sessionId, answer, questionId, userId);

        // 2. Try to find similar answer in vector database
        const similarAnswer = await MilvusService.findSimilarAnswer(question, sessionId);

        let evaluation;

        if (similarAnswer) {
            // Found similar answer, use cached evaluation
            evaluation = {
                score: similarAnswer.score || 5,
                feedback: similarAnswer.feedback || "Cached evaluation",
                strengths: similarAnswer.strengths || [],
                weaknesses: similarAnswer.weaknesses || [],
                cached: true,
            };
        } else {
            // No similar answer found, call Groq for evaluation
            evaluation = await GroqService.evaluateResponse(question, answer, level, language);

            // Save the answer vector to Milvus for future searches
            await MilvusService.insertVector({
                type: "answer",
                sessionId,
                questionId,
                userId,
                content: answer,
                level,
                language,
                timestamp: new Date(),
                score: evaluation.score,
                feedback: evaluation.feedback,
                strengths: evaluation.strengths,
                weaknesses: evaluation.weaknesses,
            });
        }

        return NextResponse.json({
            evaluation,
            cached: similarAnswer !== null,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to submit answer";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
