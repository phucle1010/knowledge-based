import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        level: { type: String, required: true },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform(_doc, ret: Record<string, unknown>) {
                const { _id, __v, ...rest } = ret;
                return { ...rest, id: (_id as mongoose.Types.ObjectId).toString() };
            },
        },
    }
);

const interviewMessageSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InterviewSession",
            required: true,
        },
        content: { type: String, required: true },
        replied_message_id: { type: String, required: true },
        user_id: { type: String, required: true },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform(_doc, ret: Record<string, unknown>) {
                const { _id, __v, ...rest } = ret;
                return { ...rest, id: (_id as mongoose.Types.ObjectId).toString() };
            },
        },
    }
);

const interviewResultSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InterviewSession",
            required: true,
        },
        score: { type: Number, required: true },
        analytics: { type: mongoose.Schema.Types.Mixed, required: true },
        advice: { type: mongoose.Schema.Types.Mixed, required: true },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform(_doc, ret: Record<string, unknown>) {
                const { _id, __v, ...rest } = ret;
                return { ...rest, id: (_id as mongoose.Types.ObjectId).toString() };
            },
        },
    }
);

export const InterviewSessionModel = mongoose.models.InterviewSession ?? mongoose.model("InterviewSession", interviewSessionSchema);

export const InterviewMessageModel = mongoose.models.InterviewMessage ?? mongoose.model("InterviewMessage", interviewMessageSchema);

export const InterviewResultModel = mongoose.models.InterviewResult ?? mongoose.model("InterviewResult", interviewResultSchema);
