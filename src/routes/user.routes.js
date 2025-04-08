import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkAuth, forgetPassword, loginUser, logoutUser, refreshAccessToken, registerUser, verifyEmail } from "../controllers/user.controllers.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/check-auth").get(verifyJWT, checkAuth);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/user-login").post(loginUser);
router.route("/user-logout").post(verifyJWT, logoutUser);
router.route("/verify-email").post(verifyEmail);
router.route("/reset-password").post(forgetPassword);

export default router;
