import { Router } from "express";
import { forgetPassword, loginUser, registerUser, verifyEmail } from "../controllers/user.controllers.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verify-email").post(verifyEmail);
router.route("/user-login").post(loginUser);
router.route("/reset-password").post(forgetPassword);

export default router;
