import { asyncHandler } from "../utils/asyncHandler.js";
import { transporter } from "./email.config.js";
import {
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplate.js";

export const sendVerificationCode = async (email, verificationToken) => {
    try {
        const response = await transporter.sendMail({
            from: '"BloPath" <satyaasingh001@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify Your Email", // Subject line
            text: "Verify Your Email", // plain text body
            html: VERIFICATION_EMAIL_TEMPLATE.replace(
                "{verificationCode}",
                verificationToken
            ), // html body
        });

        console.log("Email sent successfully", response);
    } catch (error) {
        console.log(error);
    }
};

export const sendWelcomeEmail = asyncHandler(async (labEmail) => {
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
