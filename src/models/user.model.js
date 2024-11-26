import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        ownerName: {
            type: String,
            required: true,
            trim: true,
        },
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
        verificationCode: {
            type: String,
        },
        verificationCodeExpiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("labPassword")) return next();

    this.labPassword = await bcrypt.hash(this.labPassword, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (labPassword) {
    return await bcrypt.compare(labPassword, this.labPassword);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            labEmail: this.labEmail,
            labName: this.labName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
