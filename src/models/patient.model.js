import mongoose, { Schema } from "mongoose";

const patientSchema = new Schema(
    {
        labId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        patientId: {
            type: String,
            required: true,
            unique: true
        },
        patientName: {
            type: String,
            required: true,
            trim: true,
        },
        patientAge: {
            type: String,
            required: true,
            trim: true,
        },
        patientGender: {
            type: String,
            required: true,
            trim: true,
        },
        patientEmail: {
            type: String,
            required: true,
            trim: true,
        },
        patientMobile: {
            type: String,
            required: true,
            trim: true,
        },
        patientAddress: {
            type: String,
            required: true,
            trim: true,
        },
        referBy: {
            type: String,
            required: true,
            trim: true,
        },
        sampleBy: {
            type: String,
            required: true,
            trim: true,
        },
        sample: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: String,
            required: true,
            trim: true,
        },
        discount: {
            type: String,
            required: true,
            trim: true,
        },
        totalAmount: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Patient = mongoose.model("Patient", patientSchema);
