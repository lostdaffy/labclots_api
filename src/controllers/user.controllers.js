import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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

    const user = await User.create({
        ownerName,
        labName,
        labEmail,
        labPassword,
    });

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

export { registerUser };
