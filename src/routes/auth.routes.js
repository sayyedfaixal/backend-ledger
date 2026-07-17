import express from "express";
import {
  userRegistrationController,
  loginController,
  logoutController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * - GET /api/auth/hello
 * - Simple health check route
 * - Public Route
 */
router.get("/hello", (req, res) => {
  res.send("Hello from `/helo` route");
});

/**
 * - POST /api/auth/register
 * - Register a new user
 * - Public Route
 */
router.post("/register", userRegistrationController);

/**
 * - POST /api/auth/login
 * - Authenticate an existing user
 * - Public Route
 */
router.post("/login", loginController);

/**
 * - POST /api/auth/logout
 * - Log out the authenticated user by blacklisting the token
 * - Protected Route
 */
router.post("/logout", authMiddleware, logoutController);

export default router;
