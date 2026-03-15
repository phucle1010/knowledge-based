import mongoose from "mongoose";

const knowledgeSchema = new mongoose.Schema(
    {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
        category: { type: String, required: true },
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

export const KnowledgeModel = mongoose.models.Knowledge ?? mongoose.model("Knowledge", knowledgeSchema);
