import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        labName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        labEmail: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
        },
        labPassword: {
            type: String,
            required: [true, "Password is required"],
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpiresAt: {
            type: Date,
        },
        verificationToken: {
            type: String,
        },
        verificationTokenExpiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema);
