import { Timestamp } from "./date.type";

export type Knowledge = {
    id: string;
    question: string;
    answer: string;
    isVerified: boolean;
    category: string;
} & Timestamp;
