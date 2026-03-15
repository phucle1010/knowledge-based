import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        appId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "App",
            required: true,
        },
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

const messageSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true,
        },
        content: { type: String, required: true },
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

export const SessionModel = mongoose.models.Session ?? mongoose.model("Session", sessionSchema);

export const MessageModel = mongoose.models.Message ?? mongoose.model("Message", messageSchema);
