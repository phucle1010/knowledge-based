import { Timestamp } from "./date.type";

export type App = {
    id: string;
    name: string;
    apiKey: string;
} & Timestamp;
