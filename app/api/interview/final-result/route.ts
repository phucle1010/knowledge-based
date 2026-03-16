import { NextRequest, NextResponse } from "next/server";
import { GroqService } from "@/services/groq.service";
import { InterviewLevel, InterviewLanguage } from "@/types/interview.type";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const { level, language, questions, answers, evaluations } = body as {
            level: InterviewLevel;
            language: InterviewLanguage;
            questions: string[];
            answers: string[];
            evaluations: Array<{
                score: number;
                feedback: string;
                strengths: string[];
                weaknesses: string[];
            }>;
        };

        if (!level || !language || !questions || !answers || !evaluations) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (questions.length !== answers.length || answers.length !== evaluations.length) {
            return NextResponse.json({ error: "Questions, answers, and evaluations arrays must have the same length" }, { status: 400 });
        }

        const result = await GroqService.generateFinalResult(level, language, questions, answers, evaluations);

        return NextResponse.json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to generate final result";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
