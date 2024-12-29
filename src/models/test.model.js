import mongoose, { Schema } from "mongoose";

const testSchema = new Schema(
    {
        testName: {
            type: String,
            required: true,
            unique: true
        },
        testRange: {
            type: String,
            required: true,
            unique: true
        },
        testUnit: {
            type: String,
            required: true,
            unique: true
        },
    },
    {
        timestamps: true,
    }
);

export const Test = mongoose.model("Test", testSchema);
