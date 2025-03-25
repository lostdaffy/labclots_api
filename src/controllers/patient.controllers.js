import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Patient } from "../models/patient.model.js";
import { Test } from "../models/test.model.js";


// Add Patient Controller
const addPatient = asyncHandler(async (req, res) => {
    const {
        patientName,
        patientAge,
        patientGender,
        patientEmail,
        patientMobile,
        patientAddress,
        consultant,
        sample,
        test,
        amount,
        discount,
        totalAmount,
    } = req.body;

    if (
        [
            patientName,
            patientAge,
            patientGender,
            patientEmail,
            patientMobile,
            consultant,
            sample,
            test,
            amount,
            totalAmount,
        ].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All Field are required");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(400, "user not found");
    }

    const patientId = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const patient = await Patient.create({
        labId: user._id,
        patientId,
        patientName,
        patientAge,
        patientGender,
        patientEmail,
        patientMobile,
        patientAddress,
        consultant,
        sample,
        test,
        amount,
        discount,
        totalAmount,
    });

    const createdPatient = await Patient.findById(patient._id);

    if (!createdPatient) {
        throw new ApiError(
            500,
            "Something went wrong while register the Patient"
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                createdPatient,
                "Patient Registered Successfully"
            )
        );
});

// Registered Patients Controller
const registeredPatient = asyncHandler(async (req, res) => {
    try {
        const patient = await Patient.find({ labId: req.user._id });

        if (!patient) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ patient });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Payment Receipt Controller
const paymentReceipt = asyncHandler(async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);


        if (!patient) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ patient });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add Test Controller
const addTest = asyncHandler(async (req, res) => {
    const { testName, testPrice } = req.body;

    if ([testName, testPrice].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Field are required");
    }

    const test = await Test.create({
        testName, testPrice
    });

    const createdTest = await Test.findById(test._id);

    if (!createdTest) {
        throw new ApiError(
            500,
            "Something went wrong while register the Test"
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                createdTest,
                "Test Registered Successfully"
            )
        );
});

// Show Test Controller
const showTest = asyncHandler(async (req, res) => {
    try {
        const test = await Test.find();

        if (!test) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ test });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Add Results Controller
const addResults = asyncHandler(async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);


        if (!patient) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ patient });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export {
    addPatient,
    registeredPatient,
    paymentReceipt,
    addTest,
    showTest,
    addResults,
};
