import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addPatient, addTest, registeredPatient, reportCount, showTest, singlePatient, updatePatient } from "../controllers/patient.controllers.js";

const router = Router();

router.route("/add-patient").post(verifyJWT, addPatient);
router.route("/add-test").post(verifyJWT, addTest);
router.route("/test-list").get(verifyJWT, showTest);
router.route("/patient-list").get(verifyJWT, registeredPatient);
router.route("/patient/:id").get(verifyJWT, singlePatient);
router.route("/update-patient/:id").put(verifyJWT, updatePatient);
router.route("/reportCount").get(verifyJWT, reportCount);

export default router;
