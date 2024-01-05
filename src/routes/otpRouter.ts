// routers/otpRouter.ts
import express from "express";
import * as otpController from "../controllers/otpController";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.post("/send-otp", authenticate, otpController.sendOtp);
router.post("/verify-otp", authenticate, otpController.verifyOtp);

export default router;
