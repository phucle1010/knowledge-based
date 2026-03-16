import { Timestamp } from "./date.type";

export type InterviewLevel = "intern" | "fresher" | "junior" | "middle" | "senior" | "leader";

export type InterviewSession = {
    id: string;
    title: string;
    level: InterviewLevel;
} & Timestamp;

export type InterviewMessage = {
    id: string;
    content: string;
    replied_message_id: string;
    user_id: string;
} & Timestamp;

export type InterviewResult = {
    id: string;
    sessionId: string;
    score: number;
    analytics: JSON;
    advice: JSON;
} & Timestamp;
