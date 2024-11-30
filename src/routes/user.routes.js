import { Router } from "express";
import { checkAuth, forgetPassword, loginUser, registerUser, verifyEmail } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verify-email").post(verifyEmail);
router.route("/user-login").post(loginUser);
router.route("/reset-password").post(forgetPassword);
router.route("/check-auth").get(verifyJWT, checkAuth);

export default router;
