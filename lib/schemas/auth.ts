import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: {
            type: String,
        },
        emailVerificationExpires: {
            type: Date,
        },
        passwordResetToken: {
            type: String,
        },
        passwordResetExpires: {
            type: Date,
        },
        refreshTokens: [
            {
                type: String,
            },
        ],
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform(_doc, ret: Record<string, unknown>) {
                const {
                    _id,
                    password,
                    emailVerificationToken,
                    emailVerificationExpires,
                    passwordResetToken,
                    passwordResetExpires,
                    refreshTokens,
                    __v,
                    ...rest
                } = ret;
                return { ...rest, id: (_id as mongoose.Types.ObjectId).toString() };
            },
        },
    }
);

// Indexes
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });
userSchema.index({ deletedAt: 1 });

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
