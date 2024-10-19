import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "satyaasingh001@gmail.com",
        pass: "ohju sfcw invl vcmk",
    },
});
