import mongoose from "mongoose";

import { InterviewMessageModel, InterviewSessionModel } from "@/lib/schemas/interview";
import { ENV } from "@/lib/constants/env";
import { logger } from "@/lib/utils/logger";

import { MongoService } from "@/services/mongo.service";
import { MilvusService } from "@/services/milvus.service";

import { InterviewLevel, InterviewLanguage } from "@/types/interview.type";

interface GroqMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface GroqResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

export class GroqService {
    private static readonly API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static readonly MODEL = ENV.GROQ_MODEL;

    private static async callGroqAPI(messages: GroqMessage[]): Promise<string> {
        const response = await fetch(this.API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${ENV.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: this.MODEL,
                messages,
                max_tokens: 1000,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
        }

        const data: GroqResponse = await response.json();
        return data.choices[0]?.message?.content || "";
    }

    private static async saveMessage(
        sessionId: string,
        content: string,
        role: "user" | "system",
        repliedMessageId: string | undefined,
        userId: string
    ): Promise<{ id: string; content: string }> {
        await MongoService.connect();

        const message = await InterviewMessageModel.create({
            sessionId: new mongoose.Types.ObjectId(sessionId),
            content,
            role,
            replied_message_id: repliedMessageId,
            user_id: userId,
        });

        return {
            id: message._id.toString(),
            content: message.content,
        };
    }

    static async saveUserAnswer(sessionId: string, content: string, repliedMessageId: string, userId: string): Promise<void> {
        await this.saveMessage(sessionId, content, "user", repliedMessageId, userId);
    }

    static async generateInitialQuestion(
        level: InterviewLevel,
        language: InterviewLanguage,
        sessionId: string,
        userId: string
    ): Promise<{ question: string; questionId: string }> {
        try {
            logger.info("Starting generateInitialQuestion", { level, language, sessionId, userId });

            // Get session information to access job title
            await MongoService.connect();
            const session = await InterviewSessionModel.findOne({
                _id: new mongoose.Types.ObjectId(sessionId),
                deletedAt: null,
            }).exec();

            if (!session) {
                throw new Error(`Interview session not found: ${sessionId}`);
            }

            const jobTitle = session.title;
            logger.info("Session found:", { jobTitle, level, language });

            const isVietnamese = language === "vietnamese";
            const systemPrompt = `You are an AI interviewer conducting a technical interview for a ${jobTitle} position.
        Generate an initial question appropriate for a ${level} level ${jobTitle} candidate.
        IMPORTANT: Respond ONLY in ${isVietnamese ? "Vietnamese" : "English"}. Do not mix languages or include any text in other languages like Chinese, Japanese, etc.
        The question should be written entirely in ${isVietnamese ? "Vietnamese" : "English"} and test fundamental knowledge required for the ${jobTitle} role at ${level} level.
        Focus on core skills, technologies, and concepts essential for a ${jobTitle}.
        Keep it concise and professional. Use only ${isVietnamese ? "Vietnamese" : "English"} words and terminology.`;

            const messages: GroqMessage[] = [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: `Generate an initial interview question for a ${level} level ${jobTitle} candidate. Respond only in ${isVietnamese ? "Vietnamese" : "English"}.`,
                },
            ];

            logger.info("Calling Groq API...");
            const question = await this.callGroqAPI(messages);
            logger.info("Groq API response:", question.substring(0, 100) + "...");

            logger.info("Saving message to database...");
            const messageData = await this.saveMessage(sessionId, question, "system", undefined, userId);
            logger.info("Message saved:", messageData.id);

            logger.info("Saving vector to Milvus...");
            await MilvusService.insertVector({
                type: "question",
                sessionId,
                userId,
                content: question,
                level,
                language,
                timestamp: new Date(),
                questionId: messageData.id,
            });
            logger.info("Vector saved to Milvus");

            return { question, questionId: messageData.id };
        } catch (error) {
            console.error("Error in generateInitialQuestion:", error);
            throw error;
        }
    }

    static async generateNextQuestion(
        level: InterviewLevel,
        language: InterviewLanguage,
        sessionId: string,
        userId: string,
        previousQuestions: string[],
        previousAnswers: string[],
        currentAnswer: string,
        lastMessageId: string
    ): Promise<{ question: string; questionId: string }> {
        // Get session information to access job title
        await MongoService.connect();

        const session = await InterviewSessionModel.findOne({
            _id: new mongoose.Types.ObjectId(sessionId),
            deletedAt: null,
        }).exec();

        if (!session) {
            throw new Error(`Interview session not found: ${sessionId}`);
        }

        const jobTitle = session.title;
        const isVietnamese = language === "vietnamese";
        const conversationHistory = previousQuestions.map((q, i) => `Question ${i + 1}: ${q}\nAnswer ${i + 1}: ${previousAnswers[i]}`).join("\n\n");

        const systemPrompt = `You are an AI interviewer conducting a ${jobTitle} interview. Based on the conversation history and the latest answer,
        generate the next appropriate question for a ${level} level ${jobTitle} candidate.
        IMPORTANT: Respond ONLY in ${isVietnamese ? "Vietnamese" : "English"}. Do not mix languages or include any text in other languages like Chinese, Japanese, etc.
        The question should be written entirely in ${isVietnamese ? "Vietnamese" : "English"}, progressively more challenging, and test deeper understanding of ${jobTitle} concepts and skills.
        Focus on technologies, frameworks, and best practices relevant to the ${jobTitle} role.
        If the candidate is struggling, provide easier questions. If doing well, increase difficulty.
        Keep it concise and professional. Use only ${isVietnamese ? "Vietnamese" : "English"} words and terminology.`;

        const userPrompt = `Conversation history:\n${conversationHistory}\n\nLatest answer: ${currentAnswer}\n\nGenerate the next question for a ${jobTitle} position. Respond only in ${isVietnamese ? "Vietnamese" : "English"}.`;

        const messages: GroqMessage[] = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ];

        const question = await this.callGroqAPI(messages);

        const messageData = await this.saveMessage(sessionId, question, "system", lastMessageId, userId);

        await MilvusService.insertVector({
            type: "question",
            sessionId,
            userId,
            content: question,
            level,
            language,
            timestamp: new Date(),
            questionId: messageData.id,
        });

        return { question, questionId: messageData.id };
    }

    static async evaluateResponse(
        question: string,
        answer: string,
        level: InterviewLevel,
        language: InterviewLanguage
    ): Promise<{
        score: number; // 1-10
        feedback: string;
        strengths: string[];
        weaknesses: string[];
    }> {
        const isVietnamese = language === "vietnamese";
        const systemPrompt = `You are an expert interviewer evaluating a candidate's response.
        Provide a detailed evaluation including score (1-10), feedback, strengths, and weaknesses.
        IMPORTANT: Respond ONLY in ${isVietnamese ? "Vietnamese" : "English"}. Do not mix languages or include any text in other languages.
        Be constructive and specific. Write the entire response in ${isVietnamese ? "Vietnamese" : "English"} only.`;

        const userPrompt = `Question: ${question}\n\nAnswer: ${answer}\n\nLevel: ${level}\n\nPlease evaluate this response in ${isVietnamese ? "Vietnamese" : "English"} only.`;

        const messages: GroqMessage[] = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ];

        const rawResponse = await this.callGroqAPI(messages);

        // Parse the response to extract structured data
        // This is a simple parsing - in production, you might want more robust parsing
        const lines = rawResponse.split("\n");
        let score = 5;
        const feedback = rawResponse;
        const strengths: string[] = [];
        const weaknesses: string[] = [];

        // Simple parsing logic
        for (const line of lines) {
            if (line.includes("Điểm:") || line.includes("Score:")) {
                const match = line.match(/(\d+)/);
                if (match) score = parseInt(match[1]);
            }
            if (line.includes("Điểm mạnh:") || line.includes("Strengths:")) {
                // Extract list items
            }
            // Similar for weaknesses
        }

        return {
            score: Math.max(1, Math.min(10, score)),
            feedback,
            strengths,
            weaknesses,
        };
    }

    static async generateFinalResult(
        level: InterviewLevel,
        language: InterviewLanguage,
        questions: string[],
        answers: string[],
        evaluations: Array<{
            score: number;
            feedback: string;
            strengths: string[];
            weaknesses: string[];
        }>
    ): Promise<{
        overallScore: number;
        analytics: {
            averageScore: number;
            questionCount: number;
            strengths: string[];
            weaknesses: string[];
            levelAssessment: string;
        };
        advice: {
            summary: string;
            recommendations: string[];
            nextSteps: string[];
        };
    }> {
        const conversationSummary = questions
            .map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i]}\nEvaluation: ${evaluations[i].feedback}`)
            .join("\n\n");

        const isVietnamese = language === "vietnamese";
        const systemPrompt = `You are an expert interviewer providing final assessment.
        Analyze the entire interview and provide overall score, analytics, and advice.
        IMPORTANT: Respond ONLY in ${isVietnamese ? "Vietnamese" : "English"}. Do not mix languages or include any text in other languages.
        Be comprehensive but concise. Write the entire response in ${isVietnamese ? "Vietnamese" : "English"} only.`;

        const userPrompt = `Interview Level: ${level}\n\nConversation Summary:\n${conversationSummary}\n\nProvide final assessment with overall score, analytics, and advice.`;

        const messages: GroqMessage[] = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ];

        const rawResponse = await this.callGroqAPI(messages);

        // Calculate overall score
        const totalScore = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0);
        const overallScore = Math.round(totalScore / evaluations.length);

        // Simple analytics extraction
        const allStrengths = evaluations.flatMap((e) => e.strengths);
        const allWeaknesses = evaluations.flatMap((e) => e.weaknesses);

        return {
            overallScore,
            analytics: {
                averageScore: overallScore,
                questionCount: questions.length,
                strengths: [...new Set(allStrengths)],
                weaknesses: [...new Set(allWeaknesses)],
                levelAssessment: `Candidate demonstrates ${level} level competencies with room for improvement.`,
            },
            advice: {
                summary: rawResponse,
                recommendations: [],
                nextSteps: [],
            },
        };
    }
}
