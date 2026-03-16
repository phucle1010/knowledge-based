import mongoose from "mongoose";

export type ValidateInterviewSessionInput = {
    title?: string;
    level?: string;
};

export type ValidateInterviewMessageInput = {
    sessionId?: string;
    content?: string;
    replied_message_id?: string;
    user_id?: string;
};

export type ValidateInterviewResultInput = {
    sessionId?: string;
    score?: number;
    analytics?: unknown;
    advice?: unknown;
};

export type ValidateSuccess<T> = {
    success: true;
    data: T;
};

export type ValidateFailure = {
    success: false;
    error: string;
};

export type ValidateResult<T> = ValidateSuccess<T> | ValidateFailure;

const ALLOWED_LEVELS = ["intern", "fresher", "junior", "middle", "senior", "leader"];

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const validateObjectId = (id: unknown): boolean => typeof id === "string" && mongoose.isValidObjectId(id);

export const validateInterviewSessionCreate = (body: ValidateInterviewSessionInput): ValidateResult<{ title: string; level: string }> => {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
        return { success: false, error: "title is required and must be a non-empty string" };
    }

    const level = typeof body.level === "string" ? body.level.trim() : "";
    if (!level) {
        return { success: false, error: "level is required and must be a non-empty string" };
    }
    if (!ALLOWED_LEVELS.includes(level)) {
        return { success: false, error: `level must be one of: ${ALLOWED_LEVELS.join(", ")}` };
    }

    return { success: true, data: { title, level } };
};

export const validateInterviewSessionUpdate = (body: ValidateInterviewSessionInput): ValidateResult<{ title?: string; level?: string }> => {
    const update: { title?: string; level?: string } = {};

    if (typeof body.title === "string") {
        const title = body.title.trim();
        if (!title) {
            return { success: false, error: "title must be a non-empty string when provided" };
        }
        update.title = title;
    }

    if (typeof body.level === "string") {
        const level = body.level.trim();
        if (!level) {
            return { success: false, error: "level must be a non-empty string when provided" };
        }
        if (!ALLOWED_LEVELS.includes(level)) {
            return { success: false, error: `level must be one of: ${ALLOWED_LEVELS.join(", ")}` };
        }
        update.level = level;
    }

    if (!update.title && !update.level) {
        return { success: false, error: "At least one of title or level must be provided" };
    }

    return { success: true, data: update };
};

export const validateInterviewMessageCreate = (
    body: ValidateInterviewMessageInput
): ValidateResult<{ sessionId: string; content: string; replied_message_id: string; user_id: string }> => {
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
    if (!sessionId) {
        return { success: false, error: "sessionId is required and must be a non-empty string" };
    }
    if (!validateObjectId(sessionId)) {
        return { success: false, error: "sessionId must be a valid Mongo ObjectId" };
    }

    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!content) {
        return { success: false, error: "content is required and must be a non-empty string" };
    }

    const replied_message_id = typeof body.replied_message_id === "string" ? body.replied_message_id.trim() : "";
    if (!replied_message_id) {
        return { success: false, error: "replied_message_id is required and must be a non-empty string" };
    }

    const user_id = typeof body.user_id === "string" ? body.user_id.trim() : "";
    if (!user_id) {
        return { success: false, error: "user_id is required and must be a non-empty string" };
    }

    return { success: true, data: { sessionId, content, replied_message_id, user_id } };
};

export const validateInterviewMessageUpdate = (
    body: ValidateInterviewMessageInput
): ValidateResult<Partial<{ sessionId: string; content: string; replied_message_id: string; user_id: string }>> => {
    const update: Partial<{ sessionId: string; content: string; replied_message_id: string; user_id: string }> = {};

    if (typeof body.sessionId === "string") {
        const sessionId = body.sessionId.trim();
        if (!sessionId) {
            return { success: false, error: "sessionId must be a non-empty string when provided" };
        }
        if (!validateObjectId(sessionId)) {
            return { success: false, error: "sessionId must be a valid Mongo ObjectId" };
        }
        update.sessionId = sessionId;
    }

    if (typeof body.content === "string") {
        const content = body.content.trim();
        if (!content) {
            return { success: false, error: "content must be a non-empty string when provided" };
        }
        update.content = content;
    }

    if (typeof body.replied_message_id === "string") {
        const replied_message_id = body.replied_message_id.trim();
        if (!replied_message_id) {
            return { success: false, error: "replied_message_id must be a non-empty string when provided" };
        }
        update.replied_message_id = replied_message_id;
    }

    if (typeof body.user_id === "string") {
        const user_id = body.user_id.trim();
        if (!user_id) {
            return { success: false, error: "user_id must be a non-empty string when provided" };
        }
        update.user_id = user_id;
    }

    if (!Object.keys(update).length) {
        return { success: false, error: "At least one field must be provided to update" };
    }

    return { success: true, data: update };
};

export const validateInterviewResultCreate = (
    body: ValidateInterviewResultInput
): ValidateResult<{ sessionId: string; score: number; analytics: unknown; advice: unknown }> => {
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
    if (!sessionId) {
        return { success: false, error: "sessionId is required and must be a non-empty string" };
    }
    if (!validateObjectId(sessionId)) {
        return { success: false, error: "sessionId must be a valid Mongo ObjectId" };
    }

    const score = typeof body.score === "number" ? body.score : NaN;
    if (Number.isNaN(score)) {
        return { success: false, error: "score is required and must be a number" };
    }

    const analytics = body.analytics;
    if (analytics === null || typeof analytics !== "object") {
        return { success: false, error: "analytics is required and must be an object" };
    }

    const advice = body.advice;
    if (advice === null || typeof advice !== "object") {
        return { success: false, error: "advice is required and must be an object" };
    }

    return { success: true, data: { sessionId, score, analytics, advice } };
};

export const validateInterviewResultUpdate = (
    body: ValidateInterviewResultInput
): ValidateResult<Partial<{ sessionId: string; score: number; analytics: unknown; advice: unknown }>> => {
    const update: Partial<{ sessionId: string; score: number; analytics: unknown; advice: unknown }> = {};

    if (typeof body.sessionId === "string") {
        const sessionId = body.sessionId.trim();
        if (!sessionId) {
            return { success: false, error: "sessionId must be a non-empty string when provided" };
        }
        if (!validateObjectId(sessionId)) {
            return { success: false, error: "sessionId must be a valid Mongo ObjectId" };
        }
        update.sessionId = sessionId;
    }

    if (typeof body.score === "number") {
        update.score = body.score;
    }

    if (body.analytics !== undefined) {
        if (body.analytics === null || typeof body.analytics !== "object") {
            return { success: false, error: "analytics must be an object when provided" };
        }
        update.analytics = body.analytics;
    }

    if (body.advice !== undefined) {
        if (body.advice === null || typeof body.advice !== "object") {
            return { success: false, error: "advice must be an object when provided" };
        }
        update.advice = body.advice;
    }

    if (!Object.keys(update).length) {
        return { success: false, error: "At least one field must be provided to update" };
    }

    return { success: true, data: update };
};
