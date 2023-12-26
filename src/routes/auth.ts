import express, { Router } from "express";
import { signUp, signIn } from "../controllers/authController";

// Create a router instance
const router: Router = express.Router();

// Define the signUp route
router.post("/signup", signUp);

// Define the signIn route
router.post("/signin", signIn);

// Export the router
export default router;
