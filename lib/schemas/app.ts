import mongoose from "mongoose";

const appSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        apiKey: { type: String, required: true },
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

export const AppModel = mongoose.models.App ?? mongoose.model("App", appSchema);
