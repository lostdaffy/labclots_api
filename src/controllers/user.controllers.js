import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import crypto from "crypto";
import {
    sendPasswordResetEmail,
    sendVerificationCode,
    sendWelcomeEmail,
} from "../email/email.js";

// Generate Access And Refresh Tokens Controller
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;

        await user.save({ validBeforeSave: false });

        return { refreshToken, accessToken };
    } catch (error) {
        throw new ApiError(
            500,
            "somthing went wrong while generating refresh and access tokens"
        );
    }
};

// Lab Register COntroller
const registerUser = asyncHandler(async (req, res) => {
    const { ownerName, labName, labEmail, labPassword } = req.body;

    if (
        [ownerName, labName, labEmail, labPassword].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All Field are required");
    }

    const existUser = await User.findOne({
        $or: [{ labEmail }],
    });

    if (existUser) {
        throw new ApiError(409, "User email already exists");
    }

    const verificationCode = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const user = await User.create({
        ownerName,
        labName,
        labEmail,
        labPassword,
        verificationCode,
        verificationCodeExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    console.log(user.verificationCodeExpiresAt);

    sendVerificationCode(user.labEmail, verificationCode, labName);

    const createdUser = await User.findById(user._id).select(
        "-labPassword -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while register the user");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User Registered Successfully")
        );
});

// Otp Verification Controller
const verifyEmail = asyncHandler(async (req, res) => {
    const { verificationCode } = req.body;

    try {
        const user = await User.findOne({
            verificationCode,
            verificationCodeExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            throw new ApiError(400, "Invalid or expired verification code");
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpiresAt = undefined;

        await user.save();
        await sendWelcomeEmail(user.labEmail);

        return res
            .status(201)
            .json(new ApiResponse(200, "Verification Successfully"));
    } catch (error) {
        console.log(error);
    }
});

// Lab Login Controller
const loginUser = asyncHandler(async (req, res) => {
    const { labEmail, labPassword } = req.body;

    if (!labEmail) {
        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
        $or: [{ labEmail }],
    });

    if (!user) {
        throw new ApiError(400, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(labPassword);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-labPassword -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged In Successfully"
            )
        );
});

// Check Auth Controller
const checkAuth = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-labPassword");
        console.log(user);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in check auth ", error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Forget Password Controller
const forgetPassword = asyncHandler(async (req, res) => {
    const { labEmail } = req.body;
    try {
        const user = await User.findOne({ labEmail });
        if (!user) {
            throw new ApiError(400, "User Not Found");
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(
            user.labEmail,
            `/reset-password/${resetToken}`
        );

        return res
            .status(201)
            .json(
                new ApiResponse(200, "Password reset link sent to your email")
            );
    } catch (error) {
        console.log(error);
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    User.findById(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged out"));
});

export {
    registerUser,
    verifyEmail,
    generateAccessAndRefreshTokens,
    loginUser,
    forgetPassword,
    checkAuth,
    logoutUser
};
