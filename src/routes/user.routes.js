import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkAuth, forgetPassword, loginUser, logoutUser, refreshAccessToken, registerUser, verifyEmail } from "../controllers/user.controllers.js";
import { addPatient, addResults, addTest, paymentReceipt, registeredPatient, reportCount, showTest } from "../controllers/patient.controllers.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/check-auth").get(verifyJWT, checkAuth);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/user-login").post(loginUser);
router.route("/user-logout").post(verifyJWT, logoutUser);
router.route("/verify-email").post(verifyEmail);
router.route("/reset-password").post(forgetPassword);


router.route("/add-patient").post(verifyJWT, addPatient);
router.route("/add-test").post(verifyJWT, addTest);
router.route("/test-list").get(verifyJWT, showTest);
router.route("/patient-list").get(verifyJWT, registeredPatient);
router.route("/payment-receipt/:id").get(verifyJWT, paymentReceipt);
router.route("/add-results/:id").get(verifyJWT, addResults);
router.route("/reportCount").get(verifyJWT, reportCount);

export default router;
