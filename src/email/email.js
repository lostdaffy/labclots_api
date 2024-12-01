import { asyncHandler } from "../utils/asyncHandler.js";
import { transporter } from "./email.config.js";
import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplate.js";

const sendVerificationCode = asyncHandler(
    async (labEmail, verificationCode, labName) => {
        try {
            const response = await transporter.sendMail({
                from: '"BloPath" <satyaasingh001@gmail.com>',
                to: labEmail,
                subject: "Your OTP for BloPath - Verify your email",
                text: "Your OTP for BloPath - Verify your email",
                html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode).replace("{labName}", labName),
            });

            console.log("Email sent successfully", response);

        } catch (error) {
            console.log(error);
        }
    }
);

const sendWelcomeEmail = asyncHandler(async (labEmail) => {
    try {
        const response = await transporter.sendMail({
            from: '"BloPath" <satyaasingh001@gmail.com>',
            to: labEmail,
            subject: "Welcome",
            text: "Welcome",
            html: WELCOME_EMAIL_TEMPLATE,
        });

        console.log("Welcome Email sent successfully", response);
    } catch (error) {
        console.log(error);
    }
});

const sendPasswordResetEmail = asyncHandler(async (labEmail, resetURL) => {
    try {
        const response = await transporter.sendMail({
            from: '"BloPath" <satyaasingh001@gmail.com>',
            to: labEmail,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
                "{resetURL}",
                resetURL
            ),
        });

        console.log("Reset link sent successfully", response);
    } catch (error) {
        console.log(error);
    }
});

export { sendVerificationCode, sendWelcomeEmail, sendPasswordResetEmail };
