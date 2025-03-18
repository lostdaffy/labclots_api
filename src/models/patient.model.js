import mongoose, { Schema } from "mongoose";

const patientSchema = new Schema(
    {
        labId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            default: "Pending",
            type: String
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
            trim: true,
        },
        patientMobile: {
            type: String,
            trim: true,
        },
        patientAddress: {
            type: String,
            trim: true,
        },
        consultant: {
            type: String,
            required: true,
            trim: true,
        },
        sample: {
            type: String,
            required: true,
            trim: true,
        },
        test: {
            type: String,
            required: true,
        },
        amount: {
            type: String,
            required: true,
            trim: true,
        },
        discount: {
            type: String,
            trim: true,
        },
        totalAmount: {
            type: String,
            required: true,
            trim: true,
        },
        result: [
            {
                name: {
                    required: true,
                    type: String
                },
                range: {
                    required: true,
                    type: String
                },
                unit: {
                    required: true,
                    type: String
                },
                result: {
                    required: true,
                    type: String
                },
            }
        ]
    },
    {
        timestamps: true,
    }
);

export const Patient = mongoose.model("Patient", patientSchema);
