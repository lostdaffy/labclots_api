import mongoose, { Schema } from "mongoose";

const resultSchema = new Schema(
    {
        PID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: true
        },
    },
    {
        timestamps: true,
    }
);

export const Result = mongoose.model("Result", resultSchema);
