import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { sendVerificationCode, sendWelcomeEmail } from "../email/email.js";

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

    const verificationToken = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const user = await User.create({
        ownerName,
        labName,
        labEmail,
        labPassword,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    const sentCode = sendVerificationCode(user.labEmail, verificationToken);

    if (!sentCode) {
        throw new ApiError(202, "Email not sent something went wrong");
    }

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

const verifyEmail = asyncHandler(async (req, res) => {
    const { verificationToken } = req.body;

    try {
        const user = await User.findOne({
            verificationToken,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            throw new ApiError(400, "Invalid or expired verification code");
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();
        await sendWelcomeEmail(user.labEmail);

        return res
            .status(201)
            .json(new ApiResponse(200, "Verification Successfully"));
    } catch (error) {}
});



export { registerUser, verifyEmail };
